let axios = require('axios')
let Web3 = require('web3')
let EthSignUtil = require('eth-sig-util')
let ethUtil = require('ethereumjs-util')
let BigNumber = require('bignumber.js')
let Buffer = require('safe-buffer').Buffer
let sendTx = require('./sendTx')


const DbotJson = require('./contracts/dbot/dbot.json')
const DbotFactoryJson = require('./contracts/dbot/dbotFactory.json')
const TransferChannelJson = require('./contracts/channel/transferChannels.json')
const MockBlockNumber = 1

class Atn {


  transferChannelAddress = "0x0000000000000000000000000000000000000012"

  /**
   * @method constructor method
   * @descri This method
   *
   * @param private_key
   * @param rpc_provider
   */
  constructor(private_key, rpc_provider = 'https://rpc-test.atnio.net') {
    this.web3 = new Web3(rpc_provider)
    this.account = this.web3.eth.accounts.privateKeyToAccount(private_key)
    // this.web3.eth.accounts.wallet.add(this.account)
    this.channelContract = new this.web3.eth.Contract(TransferChannelJson.abi, TransferChannelAddress)
  }


  signMessage(hash) {
    let hashNoHex = Buffer.from(hash.slice(2), 'hex')
    let privateKey = Buffer.from(this.account.privateKey.slice(2), 'hex')
    const rsv = ethUtil.ecsign(hashNoHex, privateKey)
    var rsvArray = new Array()
    rsvArray.push(ethUtil.toBuffer(rsv.r))
    rsvArray.push(ethUtil.toBuffer(rsv.s))
    rsvArray.push(ethUtil.toBuffer(rsv.v))
    // if (this._chainId > 0) {
    //   rsv.v += this._chainId * 2 + 8;
    // }
    const signMsg = ethUtil.bufferToHex(Buffer.concat(rsvArray))
    return signMsg
  }

  signBalanceProof(receiverAddress, balance) {
    const data = this.getBalanceProofData(receiverAddress, balance)
    const hash = EthSignUtil.typedSignatureHash(data)
    return this.signMessage(hash)
  }


  async addAccount(privateKey) {
    return this.web3.eth.accounts.privateKeyToAccount(privateKey);
  }

  async getDbotName(dbotAddress) {
    let dbotContract = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    return Web3.utils.hexToString(await dbotContract.methods.name().call())
  }

  async getDbotDomain(dbotAddress) {
    let dbotContract = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    return Web3.utils.hexToString(await dbotContract.methods.domain().call())
  }

  async getPrice(dbotAddress, uri, method) {
    let dbotContract = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    let key = await dbotContract.methods.getKey(Web3.utils.stringToHex(method), Web3.utils.stringToHex(uri)).call()
    let endpoint = await dbotContract.methods.keyToEndPoints(key).call()
    return endpoint.price
  }

  async getChallengePeriod() {
    let peroid = await this.channelContract.methods.challengePeriod().call()
    return peroid
  }


  // get channel info
  async getChannelInfo(receiverAddress) {
    let key = await this.channelContract.methods.getKey(this.account.address, receiverAddress, MockBlockNumber).call()
    let channel = await this.channelContract.methods.channels(key).call()
    let info = {
      'key': key,
      'deposit': channel[0],
      'blockNumber': channel[1]
    }
    return info
  }

  async getChannelDeposit(receiverAddress) {
    let info = await this._getChannelInfo(receiverAddress)
    return info['deposit']
  }

  async getChannelDetail(receiverAddress) {
    let dbotAddress = receiverAddress
    let domain = await this.getDbotDomain(dbotAddress)
    let url = `https://${domain}/api/v1/dbots/${dbotAddress}/channels/${this.account.address}`
    try {
      let res = await axios.get(url)
      if (res.data.length > 0) {
        // channel contract ensure only one channel is allowed.
        let channelDetail = res.data[0]
        channelDetail.domain = domain
        return channelDetail
      } else {
        return undefined
      }
    } catch (e) {
      console.error(e.name, e.message)
      throw new Error('Get channel detail failed.')
    }
  }

  async requestCloseSignature(receiverAddress, balance) {
    let dbotAddress = receiverAddress
    let detail = await this.getChannelDetail(dbotAddress)
    let block_number = detail.open_block_number
    // console.log(block_number)
    const URL = `https://${detail.domain}/api/v1/dbots/${dbotAddress}/channels/${this.account.address}/${detail.open_block_number}`
    console.log('Get close signature from dbot server for cooperative close channel')
    try {
      let resp = await axios.delete(URL, {params: {balance: balance}})
      if (resp.status == 200) {
        let closeSignature = resp.data.close_signature
        console.log('closeSignature is : ', closeSignature)
        return closeSignature
      } else {
        // TODO custom error
        console.error('Get close signature failed')
        throw new Error('Get close signature failed')
      }
    } catch (e) {
      throw new Error('Get close signature error')
    }
  }

  async createChannel(receiverAddress, deposit) {
    // Check if a channel is exist
    let info = await this._getChannelInfo(receiverAddress)
    if (info['deposit'] != 0 || info['blockNumber'] != 0) {
      throw new Error('Channel has exist.')
    }
    return sendTx(this.web3, this.account, this.channelContract, 'createChannel(address)', [receiverAddress], deposit)
  }

  async topUpChannel(receiverAddress, value) {
    return sendTx(this.web3, this.account, this.channelContract, 'topUp(address,uint32)', [receiverAddress, MockBlockNumber], value)
  }

  async closeChannel(receiverAddress, balance, closeSignature) {
    let balanceSignature = this._signBalanceProof(receiverAddress, balance)
    return sendTx(this.web3, this.account, this.channelContract,
      'cooperativeClose(address,uint32,uint256,bytes,bytes)',
      [receiverAddress, MockBlockNumber, balance, balanceSignature, closeSignature])
  }

  /* TODO
  async uncooperativeCloseChannel(receiverAddress, balance) {}    //chain
  async settleChannel(receiverAddress) {}                       //chain
  */

  async callDbotApi(dbotAddress, uri, method, option) {
    let channelDetail = await this.getChannelDetail(dbotAddress)
    if (channelDetail == undefined) {
      // TODO custom error for this case
      throw new Error('Channel is not synced by dbot server.')
    }
    let price = await this.getPrice(dbotAddress, uri, method)
    let domain = channelDetail['domain']
    let remainBalance = new BigNumber(channelDetail['balance'])
    let balance = remainBalance.plus(new BigNumber(price)).toString()
    let blockNumber = channelDetail['open_block_number']
    return this.callApi(dbotAddress, domain, uri, method, option, balance, blockNumber)
  }

  async callAPI(dbotAddress, domain, uri, method, option, balance, blockNumber) {
    option.url = `https://${domain}/call/${dbotAddress}${uri}`
    option.method = method
    if (option.headers == undefined || option.headers == null) {
      option.headers = {}
    }
    let balanceSignature = this.signBalanceProof(dbotAddress, balance)
    option.headers.RDN_balance = balance
    option.headers.RDN_balance_signature = balanceSignature
    option.headers.RDN_sender_address = this.account.address
    option.headers.RDN_receiver_address = dbotAddress
    option.headers.RDN_open_block = blockNumber

    try {
      return await axios(option)
    } catch (e) {

      console.error(e.response.data)
      throw e
    }
  }

  getBalanceProofData(receiverAddress, balance) {
    return [
      {
        type: 'string',
        name: 'message_id',
        value: 'Sender balance proof signature'
      },
      {
        type: 'address',
        name: 'receiver',
        value: receiverAddress
      },
      {
        type: 'uint256',
        name: 'balance',
        value: balance.toString()
      },
      {
        type: 'address',
        name: 'contract',
        value: TransferChannelAddress
      }
    ]
  }


}

module.exports = Atn
