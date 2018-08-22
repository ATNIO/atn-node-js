const sendTx = require('./sendTx')
const EthSignUtil = require('eth-sig-util')
const ethUtil = require('ethereumjs-util')
const Web3 = require('web3')
const axios = require('axios')
const bignumber = require('bignumber.js')

const privateKeyJson = require('./config/keystore')
const DbotJson = require('./contracts/dbot/dbot.json')
const DbotFactoryJson = require('./contracts/dbot/dbotFactory.json')
const TransferChannelJson = require('./contracts/channel/transferChannels.json')
const Buffer = require('safe-buffer').Buffer

const INSUF_CONFS = 'RDN-Insufficient-Confirmations'
const NONEXISTING_CHANNEL = 'RDN-Nonexisting-Channel'
const INVALID_PROOF = 'RDN-Invalid-Balance-Proof'
const INVALID_AMOUNT = 'RDN-Invalid-Amount'

const defaultValue = 10

module.exports = class Atn {


  // constructor(web3   | { currentProvider  } = 'ws://localhost:7576') {
  constructor(private_key, rpc_provider = 'http://localhost:8545') {

    this.dbotDefaultAddress = '0x0000000000000000000000000000000000000011'

    this.dbotFactoryDefaultAddress = '0x0000000000000000000000000000000000000011'

    this.tcmcDefaultAddress = '0x0000000000000000000000000000000000000012'

    this.private_key = privateKeyJson.privateKey

    this.web3 = new Web3(rpc_provider)

    this.dmc = new this.web3.eth.Contract(DbotJson.abi, this.dbotDefaultAddress)

    this.dfmc = new this.web3.eth.Contract(DbotFactoryJson.abi, this.dbotFactoryDefaultAddress)

    this.tcmc = new this.web3.eth.Contract(TransferChannelJson.abi, this.tcmcDefaultAddress)


  }


  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param {string | Account} account
   */
  addAccount(private_key) {
    var account = this.web3.eth.accounts.privateKeyToAccount('0x' + this.private_key)
    this.web3.eth.accounts.wallet.add(account)
  }


  getDefaultAccount() {
    return this.web3.eth.defaultAccount
  }

  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param account
   */
  setDefaultAccount(privateKey) {
    let account = this.web3.eth.accounts.privateKeyToAccount('0x' + privateKey)
    this.web3.eth.defaultAccount = account.address
    console.log('setD  ', account.address)
  }

  /**
   * @method Web3 Method - addAccount
   * @desc
   * @param dbotAddress
   * @returns {Promise<*>}
   */
  async register(dbotAddress) {
    console.log('================================Register=================================')
    return sendTx(this.web3, this.dfmc, 'register(address)', [dbotAddress])
  }


  /**
   * @method Web3 Method - idToAddress
   * @desc
   *
   * @param dbotId
   * @returns {Promise<*>}
   */
  idToAddress(dbotId) {
    return sendTx(this.web3, this.dfmc, 'idToAddress', [dbotId], null)
  }


  /**
   * @method Web3 Method - changeName
   * @desc
   *
   * @param name
   * @param dbotAddress
   * @param from
   * @returns {Promise<*>}
   */
  async changeName(name, dbotAddress, from) {
    this.setDefaultAccount(from)
    const initialDbot = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    return sendTx(this.web3, initialDbot, 'changeName(bytes32)', [name], null)
  }


  /**
   * @method Web3 Method - changeDomain
   * @desc   This is a method change the Dbot's domain
   *
   * @param domain
   * @param dbotAddress
   * @param from
   * @returns {Promise<*>}
   */
  async changeDomain(domain, dbotAddress, from) {
    this.setDefaultAccount(from)
    const initialDbot = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    return sendTx(this.web3, initialDbot, 'changeDomain(bytes32)', [domain], null)
  }


  /**
   * @method Web3 Method - addEndPoint
   * @desc   This is a method add Dbot's endPoint
   *
   *
   * @param method
   * @param price
   * @param uri
   * @param dbotAddress
   * @param from
   * @returns {Promise<*>}
   */
  async addEndPoint(method, price, uri, dbotAddress, from) {
    this.setDefaultAccount(from)
    const initialDbot = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    return sendTx(this.web3, initialDbot, 'addEndPoint(bytes32,uint256,bytes32)', [method, price, uri], null)
  }


  /**
   * @method Web3 Method - updateEndPoint
   * @desc   This is a method to update endPoint of Dbot's
   *
   *
   * @param method
   * @param price
   * @param uri
   * @param dbotAddress
   * @param from
   * @returns {Promise<*>}
   */
  async updateEndPoint(method, price, uri, dbotAddress, from) {
    this.setDefaultAccount(from)
    const initialDbot = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    return sendTx(this.web3, initialDbot, 'updateEndPoint(bytes32,uint256,bytes32)', [method, price, uri])
  }


  /**
   * @method Web3 Method - deleteEndPoint
   * @desc
   *
   * @param method
   * @param uri
   * @param dbotAddress
   * @param from
   * @returns {Promise<*>}
   */
  async deleteEndPoint(method, uri, dbotAddress, from) {
    this.setDefaultAccount(from)
    const initialDbot = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    return sendTx(this.web3, initialDbot, 'deleteEndPoint(bytes32,bytes32)', [method, uri])
  }


  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param transferChannelContract
   * @returns {*}
   */
  async getOwnerAddress(transferChannelContract) {
    const rmtc = new this.web3.eth.Contract(TransferChannelJson.abi, transferChannelContract)
    return rmtc.methods.ownerAddress().call()
  }


  /**
   * @method Web3 Method - getChannelInfo
   * @desc
   *
   * @param receiverAddress
   * @param senderAddress
   * @param blockNumber
   * @returns {Promise<*>}
   */
  async getChannelInfo(receiverAddress, senderAddress, blockNumber) {
    // return sendTx(this.web3, this.tcmc, 'getChannelInfo(address,address,uint32)', [senderAddress, receiverAddress, blockNumber])
    return this.tcmc.methods.getChannelInfo(senderAddress, receiverAddress, blockNumber)
  }


  /**
   * @method Web3 Method - topUp
   * @desc This is a method to topup the channel deposit
   *
   * @param receiverAddress
   * @param senderAddress
   * @param blockNumber
   * @param value
   * @returns {Promise<*>}
   */
  async topUp(receiverAddress, senderAddress, blockNumber, value) {
    return sendTx(this.web3, this.tcmc, 'topUp(address,address,uint32)', [senderAddress, receiverAddress, blockNumber], value)
    // return this.tcmc.methods.topUp(receiverAddress, senderAddress, blockNumber).send({ from, value })
  }


  /**
   * @method Web3 Method - getKey
   * @desc This is a method to get channel mapping key
   *
   * @param senderAddress
   * @param receiveAddress
   * @param blockNumber
   * @param from
   * @returns {Promise<any>}
   */
  async getKey(senderAddress, receiveAddress, blockNumber, from) {
    this.setDefaultAccount(from)
    return this.tcmc.methods.getKey(senderAddress, receiveAddress, blockNumber).call({ from: from })
    // return sendTx(this.web3, this.tcmc, 'getKey', [senderAddress, receiveAddress, blockNumber])
  }


  /**
   * @method Web3 Method - keyToChannel
   * @desc
   *
   * @param channelKey
   * @param from
   * @returns {Promise<*>}
   */
  async keyToChannel(channelKey, from) {
    this.setDefaultAccount(from)
    // return sendTx(this.web3, this.tcmc, 'channels', [channelKey])
    return this.tcmc.methods.channels(channelKey).call({ from: from })
  }


  /**
   * @method Web3 Method - getWithdrawbalance
   * @desc
   *
   * @param key
   * @param from
   * @returns {Promise<*>}
   */
  async getWithdrawbalance(key, from) {
    this.setDefaultAccount(from)
    // return sendTx(this.web3, this.tcmc, 'withdrawn_balances(uint256)', [key])
    return this.tcmc.methods.withdrawn_balances(key).call({ from })
  }


  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param receiverAddress
   * @param blockNumber
   * @param balance
   * @param from
   * @returns {Promise<string>}
   */
  getBanlanceSign(receiverAddress, blockNumber, balance) {
    const params = this.getBalanceProofSignatureParams(receiverAddress, blockNumber, balance)
    const hash = EthSignUtil.typedSignatureHash(params)
    const sig = this.signMessage(hash)
    return sig
  }


  /**
   * sign
   * @param hash
   * @returns {Promise<String>}
   */
  signMessage(hash) {
    let hashNoHex = Buffer.from(hash.slice(2), 'hex')
    let privateKey = Buffer.from(this.private_key, 'hex')
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


  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param receiverAddress
   * @param blockNumber
   * @param balance
   * @returns {*[]}
   */
  getBalanceProofSignatureParams(receiverAddress, blockNumber, balance) {
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
        type: 'uint32',
        name: 'block_created',
        value: '' + blockNumber
      },
      {
        type: 'uint256',
        name: 'balance',
        value: balance.toString()
      },
      {
        type: 'address',
        name: 'contract',
        value: this.tcmcDefaultAddress
      }
    ]
  }


  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param key
   * @param from
   * @returns {Promise<*>}
   */
  async getClosingRequests(key, from) {
    this.setDefaultAccount(from)
    // return sendTx(this.web3, this.tcmc, 'closing_requests', [key])
    return this.tcmc.methods.closing_requests(key).call({ from })
  }


  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param receiverAddress
   * @param blockNumber
   * @param value
   * @param from
   * @returns {Promise<*>}
   */
  async topupChannel(receiverAddress, blockNumber, value) {
    return sendTx(this.web3, this.tcmc, 'topUp(address,bytes32)', [receiverAddress, blockNumber], value)
  }

  // /**
  //  * @method Web3 Method - addAccount
  //  * @desc
  //  *
  //  * @param senderAddress
  //  * @param receiverAddress
  //  * @param blockNumber
  //  * @param value
  //  * @param from
  //  * @returns {Promise<*>}
  //  */
  // topUpdateDelegateChannel(senderAddress, receiverAddress, blockNumber, value, from) {
  //   this.setDefaultAccount(from)
  //   return sendTx(this.web3, this.tcmc, 'topUpDelegate(address,address,uint32)', [senderAddress, receiverAddress, blockNumber])
  //   // return this.tcmc.methods.topUpDelegate(senderAddress, receiverAddress, blockNumber).send({ from, value })
  // }


  /**
   * @method Web3 Method - settleChannel
   * @desc
   *
   * @param receiveAddress
   * @param blockNumber
   * @param from
   * @returns {Promise<*>}
   */
  asyc settleChannel(receiveAddress, blockNumber, from) {
    this.setDefaultAccount(from)
    return sendTx(this.web3, this.tcmc, 'settle(address,uint32)', [receiveAddress, blockNumber])
    // return this.tcmc.methods.settle(receiveAddress, blockNumber).send({ from })
  }


  async callAPI(dbotAddress, method, uri, option) {
    // 1. dbot init first
    let dbotContract
    try {
      dbotContract = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    } catch (e) {
      const errMsg = 'CallAI ' + e.name + ':' + 'Init DbotContract Fail' + e.message
      console.log(errMsg)
      return new Promise < String > (resolve => {
        return resolve(errMsg)
      })
    }
    // 2. 判断 EndPoint是否存在于链上  如果在验证通过，不再提示用户链上在自己的dbot上注册Endpoint信息
    // const dbotDomain = Web3.utils.hexToString(await dbotContract.methods.domain().call({  }))
    const dbotDomain = Web3.utils.hexToString(await dbotContract.methods.domain().call({ from: this.web3.eth.defaultAccount }))
    const key = await dbotContract.methods.getKey(Web3.utils.stringToHex(method), Web3.utils.stringToHex(uri)).call({ from: this.web3.eth.defaultAccount })
    console.log('CallAI Key', key)
    let endPoint
    try {
      // endPoint = await sendTx(this.web3, dbotContract, 'keyToEndPoints(bytes32)', [key])
      endPoint = await dbotContract.methods.keyToEndPoints(key).call({ from: this.web3.eth.defaultAccount })
      console.log('CallAI EndPoint', endPoint)
    } catch (e) {
      const errMsg = 'CallAI ' + e.name + ':' + 'Get EndPoint Fail' + e.message
      console.log(errMsg)
      return new Promise < String > (resolve => {
        return resolve(errMsg)
      })
    }
    //3. channel是否存在，存在则不需要open，不存在open
    let url = `http://${dbotDomain}/api/v1/dbots/${dbotAddress}/channels/${this.web3.eth.defaultAccount}`
    let channelInfoAarry
    try {
      channelInfoAarry = await axios.get(url)
      console.log('==================================11111', channelInfoAarry.data[0])
    } catch (e) {
      console.error(e.name, e.message)
      throw new Error('Get channels from server error')
    }
    let channelInfo = channelInfoAarry.data[0]
    //4.获取Dbot地址之后要验证 签名是否正确
    const bigBalance = new bignumber.BigNumber(channelInfo.balance)
    // console.log(' endPoint.price          ==============',  endPoint.price)
    // bigBalance.plus(new bignumber.BigNumber(endPoint.price, 10))
    const newBalance = channelInfo.balance + parseInt(endPoint.price)
    const dbotURL = `http://${dbotDomain}/call/${dbotAddress}${uri}`
    console.log('callAI Proxy URL==========', dbotURL)
    option.url = dbotURL
    let blockNum = channelInfo.open_block_number
    let balanceSigature = this.getBanlanceSign(dbotAddress, blockNum, newBalance)
    // 将balance和price注册到请求头中
    option.headers.RDN_balance = newBalance
    option.headers.RDN_balance_signature = balanceSigature
    option.headers.RDN_sender_address = channelInfo['sender']
    option.headers.RDN_receiver_address = channelInfo['receiver']
    option.headers.RDN_open_block = channelInfo['open_block_number']
    console.log('Request option headers---------------------------------------------------------------- :', option.headers.toString())
    console.log('Request option data---------------------------------------------------------------- :', option.data.toString())

    let result = await axios(option)
    console.log('Request option=========================:\n', result.response)
    if (result.status === 200) {
      return result
    } else if (result.status === 402) {
      console.log('402-----------------', result.headers)
    } else {
      return new Promise(result.data)
    }
    // console.log('-------------callAPI result-------------', result)
    return result
  }


  /**
   * @method Web3 Method - openChannel
   * @desc If you
   *
   * @param receiverAddress
   * @param value
   * @param from
   * @returns {Promise<*>}
   */
  async openChannel(receiverAddress, value) {
    console.log('--------------------openChannel--------------------', receiverAddress, value)
    let dbotWeb3 = new this.web3.eth.Contract(DbotJson.abi, receiverAddress)
    console.log('receiverAddress: ', receiverAddress)
    console.log('--------------------', this.web3.eth.defaultAccount)
    let domain = Web3.utils.hexToString(await dbotWeb3.methods.domain().call({ from: this.web3.eth.defaultAccount }))
    let url = `http://${domain}/api/v1/dbots/${receiverAddress}/channels`
    let channelInfo
    try {
      channelInfo = await axios.get(url)
    } catch (e) {
      console.error(e.name, e.message)
      throw new Error('Get channels from server error')
    }
    //请求dbot服务器地址，判断channel是否存在
    if (channelInfo.status == 200) {
      // console.log('---------channelInfo ', channelInfo)
      console.log('---------channelInfo.data ', channelInfo.data)
      console.log('---------channelInfo.data.length ', channelInfo.data.length)
      if (channelInfo.data.length === 0) {
        console.log('OpenChannel Contract Start-------------------------')
        return sendTx(this.web3, this.tcmc, 'createChannel(address)', [receiverAddress], value)
      } else {
        console.log('-------- Channel has exist ---------', receiverAddress, value)
        throw new Error('Channel has exist')
      }
    } else {
      console.log('OpenChannel Method:Error response from dbot server', channelInfo)
      throw new Error('Error response from dbot server')
    }
  }


  /**
   * @method Channel Method CloseChannel
   * @desc If
   *
   * @param receiverAddress
   * @param senderAddress
   * @param dbotAddress
   * @param blockNumber
   * @param balance
   * @returns {Promise<*>}
   */
  async closeChannel(receiverAddress, senderAddress, dbotAddress, blockNumber, balance) {
    var dbotWeb3 = new this.web3.eth.Contract(DbotJson.abi, receiverAddress)
    var domain = Web3.utils.hexToString(await dbotWeb3.methods.domain().call({ from: receiverAddress }))
    const URL = `http://${domain}/api/v1/dbots/${dbotAddress}/channels/${senderAddress}/${blockNumber}`.toString()
    console.log('--------------------CloseChannel delete. url--------------------', URL)
    let closeSignChannelInfo
    try {
      closeSignChannelInfo = await axios.delete(URL, { data: { balance: balance } })
      console.log('closeSignChannelInfo : ', closeSignChannelInfo.data)
    } catch (e) {
      console.error(e.name, e.message)
      throw new Error('Get Delete Close_Signature Error')
    }
    if (closeSignChannelInfo.status == 200) {
      let banlanceSignature = await this.getBanlanceSign(receiverAddress, blockNumber, balance)
      console.log('self banlanceSignature', banlanceSignature)
      let closeSignature = closeSignChannelInfo.data.close_signature
      return sendTx(this.web3, this.tcmc, 'cooperativeClose(address,uint32,uint256,bytes,bytes)', [dbotAddress, blockNumber, balance, banlanceSignature, closeSignature])
    } else {
      throw new Error('CloseChannel Method:Error response from dbot server')
    }

  }
}






