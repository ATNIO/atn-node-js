let axios = require('axios')
let Web3 = require('web3')
let EthSignUtil = require('eth-sig-util')
let ethUtil = require('ethereumjs-util')
let BigNumber = require('bignumber.js')
let Buffer = require('safe-buffer').Buffer
let sendTx = require('./sendTx')
let accountTool = require('./tools/account')

const DbotJson = require('./contracts/dbot/dbot.json')
const TransferChannelJson = require('./contracts/channel/transferChannel.json')
const MockBlockNumber = 1
const transferChannelAddress = "0x0000000000000000000000000000000000000012";
const deposit = 1e18

class Atn {


  /**
   * @method constructor method
   * @descri This method
   *
   * @param private_key
   * @param rpc_provider
   */
  constructor(private_key, rpc_provider = 'https://rpc-test.atnio.net', env = 'prod') {

    this.web3 = new Web3(rpc_provider)

    this.account = this.web3.eth.accounts.privateKeyToAccount(private_key)
    // this.web3.eth.accounts.wallet.add(this.account)
    this.channelContract = new this.web3.eth.Contract(TransferChannelJson.abi, transferChannelAddress)
    if (env && typeof env === 'string' && env.toLowerCase() !== this.PRODUCT_ENV) {
      this.hyperProtocolType = 'https'
    } else {
      this.hyperProtocolType = 'http'
    }
  }


  /**
   * @method
   * @descri 创建AI调用通道
   *
   * @param receiverAddress
   * @param deposit
   * @returns {Promise<*>}
   */
  async createChannel(receiverAddress, deposit) {
    // Check if a channel is exist
    let info = await this.getChannelInfo(receiverAddress)
    if (info['deposit'] != 0 || info['blockNumber'] != 0) {
      throw new Error('Channel has exist.')
    }
    return sendTx(this.web3, this.account, this.channelContract, 'createChannel(address)', [receiverAddress], deposit)
  }


  /**
   * @descri 获取ATN Chain上的AI调用通道信息
   *
   * @param receiverAddress
   * @returns {Promise<{key: any, deposit: *, blockNumber: *}>}
   */
  async getChannelInfo(receiverAddress) {
    let key = await this.channelContract.methods.getKey(this.account.address, receiverAddress, MockBlockNumber).call()
    let channel = await this.channelContract.methods.channels(key).call()
    let info = {'key': key, 'deposit': channel[0], 'blockNumber': channel[1]}
    return info
  }


  /**
   * @descri 查询DBotServer 上存在的AI调用通道信息
   *
   * @param receiverAddress
   * @returns {Promise<*>}
   */
  async getChannelDetail(receiverAddress) {
    let dbotAddress = receiverAddress
    let domain = await this.getDbotDomain(dbotAddress)
    const channelInfoURL = `${this.handlerDbotDomain(domain, this.hyperProtocolType)}/api/v1/dbots/${dbotAddress}/channels/${this.account.address}`
    console.log('-----------getChannelDetail-----------', channelInfoURL)
    try {
      let res = await axios.get(channelInfoURL)
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

  /**
   * @method
   * @descri 关闭AI调用通道
   *
   * @param receiverAddress
   * @param balance
   * @param closeSignature
   * @returns {Promise<*>}
   */
  async closeChannel(receiverAddress, balance) {
    let dbotContract
    try {
      dbotContract = new this.web3.eth.Contract(DbotJson.abi, receiverAddress)
    } catch (e) {
      return CloseChannelException1
    }
    const dbot = {} as Dbot
    dbot.domain = Web3.utils.hexToString(await dbotContract.methods.domain().call({from}))

    const channelDetail = await this.getChannelInfo(receiverAddress, from)
    const blockNumber = channelDetail.blockNumber
    const targetUrl = this.handlerDbotDomain(dbot.domain, this.hyperProtocolType)
    const URL = `${targetUrl}/api/v1/dbots/${receiverAddress}/channels/${from}/${blockNumber}`
    let closeSignChannelInfo
    try {
      closeSignChannelInfo = await axios.delete(URL, {params: {balance: balance}})
    } catch (e) {
      console.error(e.name, e.message)
      return new Error(e.toString())
    }
    const closeSignature = closeSignChannelInfo.data.close_signature
    let balanceSignature = this.signBalanceProof(receiverAddress, balance)
    return sendTx(this.web3, this.account, this.channelContract, 'cooperativeClose(address,uint32,uint256,bytes,bytes)',
      [receiverAddress, MockBlockNumber, balance, balanceSignature, closeSignature])
  }


  /**
   * @method
   * @descri 增加通道调用次数
   *
   * @param receiverAddress
   * @param value
   * @returns {Promise<*>}
   */
  async topUpChannel(receiverAddress, value) {
    return sendTx(this.web3, this.account, this.channelContract, 'topUp(address,uint32)', [receiverAddress, MockBlockNumber], value)
  }


  /**
   * @method
   * @descri 初始化调用通道
   *
   * @param dbotAddress
   * @param private_key
   * @returns {Promise<*>}
   */
  async initChannel(dbotAddress, private_key, times ) {
    let account
    if (private_key === undefined) {
      account = await this.createAccount()
    } else {
      account = this.initAccount(private_key)
    }
    const addAccountResult = await this.addAccount(account.address)

    console.log('add account info ', addAccountResult)
    //TODO 1312321312
    // const price =
    const createChannelResult = await this.createChannel(account.address, deposit)
    return createChannelResult
  }

  /**
   * @descri 创建账号，获取 private_key 可选
   * @param private_key
   * @returns {Promise<*>}
   */
  async initAccount(private_key) {
    if (private_key) {
      console.log('------------init Channel private key-------------', private_key)
      let accountObj = await this.privateKeyToAccount(private_key)
      if (!accountObj) {
        return accountObj
      } else {
        throw new Error('no account on chain')
      }
    }
  }


  /**
   * @method
   * @descri
   *
   * @param hash
   * @returns {String}
   */
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


  /* TODO
  async uncooperativeCloseChannel(receiverAddress, balance) {}    //chain
  async settleChannel(receiverAddress) {}                       //chain
  */

  /**
   * @method
   * @descri 调用DBotServer AI服务
   *
   * @param dbotAddress
   * @param uri
   * @param method
   * @param option
   * @returns {Promise<*|void>}
   */
  async callDBotAI(dbotAddress, uri, method, option) {
    let channelDetail = await this.getChannelDetail(dbotAddress)
    if (channelDetail == undefined) {
      throw new Error('Channel is not synced by dbot server.')
    }
    let price = await this.getPrice(dbotAddress, uri, method)
    let domain = channelDetail['domain']
    let remainBalance = new BigNumber(channelDetail['balance'])
    let balance = remainBalance.plus(new BigNumber(price)).toString()
    let blockNumber = channelDetail['open_block_number']
    return this.callAPI(dbotAddress, domain, uri, method, option, balance, blockNumber)
  }

  /**
   * @descri
   *
   * @param dbotAddress
   * @param domain
   * @param uri
   * @param method
   * @param option
   * @param balance
   * @param blockNumber
   * @returns {Promise<void>}
   */
  async callAPI(dbotAddress, domain, uri, method, option, balance, blockNumber) {
    option.url = `${this.handlerDbotDomain(domain, this.hyperProtocolType)}/call/${dbotAddress}${uri}`
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


  /**
   * @method :
   * @descri : 处理DBotServer的domain
   *
   * @param domain
   * @param hyperProtocolType
   * @returns {string}
   */
  handlerDbotDomain(domain, hyperProtocolType) {
    const result = domain.toLowerCase().startsWith('http') ? domain : hyperProtocolType.concat('://').concat(domain)
    return result
  }


  /**
   * @method
   * @descri 通过私钥获取账户信息
   *
   * @param privateKey
   * @returns {Promise<Account>}
   */
  async privateKeyToAccount(privateKey) {
    return this.web3.eth.accounts.privateKeyToAccount(privateKey);
  }


  /**
   * @method unlockAccountsIfNeeded
   * @descri 解锁单个账户
   *
   * @param account
   * @param password
   * @param unlock_duration_sec
   * @returns {Promise<void>}
   */
  async unlockAccountsIfNeeded(account, password, unlock_duration_sec) {
    accountTool.unlockSingleAccountIfNeeded(account, password, unlock_duration_sec)
  }


  /**
   * @desri 创建账户
   *
   * web3.eth.accounts.create([entropy]);
   * @returns {Promise<Account>}
   */
  async createAccount() {
    return web3.eth.accounts.create();
  }

  /**
   * @method
   * @descri 向钱包增加账户
   *
   * @param account
   * @returns {Promise<any>}
   */
  async addAccount(account) {
    return this.web3.eth.accounts.wallet.add(account)
  }


  /**
   * @method
   * @descri 向DBotServer服务获取Balance签名
   *
   * @param receiverAddress
   * @param balance
   * @returns {Promise<*>}
   */
  async requestCloseSignature(receiverAddress, balance) {
    let detail = await this.getChannelDetail(receiverAddress)
    const blockNumber = detail.blockNumber
    const URL = `${this.handlerDbotDomain(domain, this.hyperProtocolType)}/api/v1/dbots/${receiverAddress}/channels/${from}/${blockNumber}`.toString()
    console.log('-----------getChannelDetail-----------', URL)
    let resp
    try {
      resp = await axios.delete(URL, {params: {balance: balance}})
      return resp.data.close_signature;
    } catch (e) {
      throw new Error('Get close signature error')
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
        value: transferChannelAddress
      }
    ]
  }


}

module.exports = Atn
