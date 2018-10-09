let axios = require('axios')
let Web3 = require('web3')
let EthSignUtil = require('eth-sig-util')
let ethUtil = require('ethereumjs-util')
let BigNumber = require('bignumber.js')
let Buffer = require('safe-buffer').Buffer
let sendTx = require('./sendTx')
let accountTool = require('./tools/account')
let fs = require('fs')
let appRootPath = require('app-root-path').resolve('');

const DbotJson = require('./contracts/dbot/dbot.json')
const TransferChannelJson = require('./contracts/channel/transferChannel.json')
const MockBlockNumber = 1
const transferChannelAddress = "0x0000000000000000000000000000000000000012";
const defaultDeposit = 10e18

/**
 * @class
 * @classdesc Atn class contains all the method
 */
class Atn {


  /**
   * @construct Atn
   *
   * @param {string} private_key - 账户私钥
   * @param {string} rpc_provider - 'https://rpc-test.atnio.net' - 连接节点默认为https://rpc-test.atnio.net
   * @param {string} env = 'prod' - 环境变量默认 prod
   */
  constructor(private_key, {rpc_provider = 'https://rpc-test.atnio.net', env = 'prod'} = {}) {

    this.web3 = new Web3(rpc_provider)

    this.account = this.web3.eth.accounts.privateKeyToAccount(private_key)

    this.channelContract = new this.web3.eth.Contract(TransferChannelJson.abi, transferChannelAddress)

    /**
     * @constant {string}
     * @default  {string}  prod
     */
    this.PRODUCT_ENV = 'prod'

    if (env && typeof env === 'string' && env.toLowerCase() !== this.PRODUCT_ENV) {
      this.hyperProtocolType = 'http'
    } else {
      this.hyperProtocolType = 'https'
    }
  }


  /**
   * @method
   * @desc 创建账户和DBotServer之间的调用通道
   *
   * @param {string} receiverAddress - AI Market上DBot地址
   * @param {string} deposit - 创建调用通道所需的总次数(1e18的倍数)
   * @returns {Promise<PromiEvent<TransactionReceipt>>} - json example :
   ```json
   {
       "blockHash": "0x60a779ef28803a01bf825fb0d378e9e40edd9c33ef5d8379274d0fdfe4b1b451",
        "blockNumber": 400442,
        "contractAddress": null,
        "cumulativeGasUsed": 66603,
        "from": "0xa474a12b81b443854414c3c3928b0ec44adfde06",
        "gasUsed": 66603,
        "logs": [
            {
                "address": "0x0000000000000000000000000000000000000012",
                "topics": [
                    "0xa55ac5ebdb9bee5da90c5d4a6f104e5e2c116f97967ae2eb73f5fdfbdbb75bcb",
                    "0x000000000000000000000000a474a12b81b443854414c3c3928b0ec44adfde06",
                    "0x0000000000000000000000000aa602cb3a0919a95cb066b9d3ed99d391c395d5"
                ],
                "data": "0x00000000000000000000000000000000000000000000000029a2241af62c0000",
                "blockNumber": 400442,
                "transactionHash": "0x54168dfed7d0d1b3e5bac787b76ea490fd0c1b5e80674acdea4e241869462220",
                "transactionIndex": 0,
                "blockHash": "0x60a779ef28803a01bf825fb0d378e9e40edd9c33ef5d8379274d0fdfe4b1b451",
                "logIndex": 0,
                "removed": false,
                "id": "log_a4ba0d17"
            }
        ],
        "logsBloom": "0x00000000000000000000020000000000000000000000000000000000000010000000000000000000000000000000000000020000000000000000000000000400000000088000000000000000000000000000000000100000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000400",
        "status": true,
        "to": "0x0000000000000000000000000000000000000012",
        "transactionHash": "0x54168dfed7d0d1b3e5bac787b76ea490fd0c1b5e80674acdea4e241869462220",
        "transactionIndex": 0
    }
   ```
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
   * @method
   * @desc 获取账户和DBotServer之间通道信息
   *
   * @param {string} receiverAddress - DBot地址
   * @returns {Promise<{key: any, deposit: *, blockNumber: *}>}
   */
  async getChannelInfo(receiverAddress) {
    let key = await this.channelContract.methods.getKey(this.account.address, receiverAddress, MockBlockNumber).call()
    let channel = await this.channelContract.methods.channels(key).call()
    let info = {'key': key, 'deposit': channel[0], 'blockNumber': channel[1]}
    return info
  }


  /**
   * @method
   * @descri  查询DBotServer 上存在的AI调用通道信息
   *
   * @param {string} receiverAddress - DBot地址
   * @returns {Promise<*>} - json example :
   ```json
   {
    "status": 1,
    "data": {
        "receiver": "0xE4640e4005903e147EbB54dd9DDf17e85Ce53303",
        "sender": "0xA474A12B81B443854414C3C3928B0eC44AdFdE06",
        "open_block_number": "353401",
        "deposit": "15000000000000000000",
        "balance": "12000000000000000000",
        "state": "OPEN",
        "settle_block_number": "-1",
        "confirmed": true,
        "unconfirmed_topups": {},
        "domain": "https://dbot02.atnio.net"
     }
   }
   ```
   */
  async getChannelDetail(receiverAddress) {
    let dbotAddress = receiverAddress
    let domain = await this.getDBotDomain(dbotAddress)
    const channelInfoURL = `${this.handlerDBotDomain(domain, this.hyperProtocolType)}/api/v1/dbots/${dbotAddress}/channels/${this.account.address}`
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
   * @descr 关闭AI调用通道
   *
   * @param {string} receiverAddress - DBot地址
   * @param {string | BigNumber} balance - 关闭调用通道所需的Balance
   * @returns {Promise<*>} - json
   */
  async closeChannel(receiverAddress, balance) {
    let dbotContract
    try {
      dbotContract = new this.web3.eth.Contract(DbotJson.abi, receiverAddress)
    } catch (e) {
      return new Error(e.toString())
    }
    const dbot = {}
    const from = this.account.address
    dbot.domain = Web3.utils.hexToString(await dbotContract.methods.domain().call({from}))

    const channelDetail = await this.getChannelInfo(receiverAddress)
    const blockNumber = channelDetail.blockNumber
    const targetUrl = this.handlerDBotDomain(dbot.domain, this.hyperProtocolType)
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
   * @desc  增加通道调用次数
   *
   * @param {string} receiverAddress - DBot地址
   * @param {string | BigNumber} value - 增加Channel账户余额
   * @returns {Promise<*>} - json example :
   ```json
   {
        "blockHash": "0xbda32b2468966071cd59e7595b280b3c4eaf3e35125ed9a9ea41b793863a1dd9",
        "blockNumber": 559929,
        "contractAddress": null,
        "cumulativeGasUsed": 32501,
        "from": "0xa474a12b81b443854414c3c3928b0ec44adfde06",
        "gasUsed": 32501,
        "logs": [
            {
                "address": "0x0000000000000000000000000000000000000012",
                "topics": [
                    "0x19034e235e9fae58965e705631a9e662529152bc990b7db2aca8aeb6389f006f",
                    "0x000000000000000000000000a474a12b81b443854414c3c3928b0ec44adfde06",
                    "0x000000000000000000000000e4640e4005903e147ebb54dd9ddf17e85ce53303",
                    "0x000000000000000000000000000000000000000000000000000000000006be88"
                ],
                "data": "0x00000000000000000000000000000000000000000000000029a2241af62c0000",
                "blockNumber": 559929,
                "transactionHash": "0x1eff8db75a957a8ce80ac6f33cea0342365ef74d275c55eecde349bb47b837f1",
                "transactionIndex": 0,
                "blockHash": "0xbda32b2468966071cd59e7595b280b3c4eaf3e35125ed9a9ea41b793863a1dd9",
                "logIndex": 0,
                "removed": false,
                "id": "log_0782a4ac"
            }
        ],
        "logsBloom": "0x00000000000000000000020000000000000000000000000000000000000010000000000000000000000100000000000000000000000000000000000000000400000000008000000000000000000000000000000000001000200000000201000000000000000000000080000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000100000000000000008000000000000000000000000000000000000008000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000100000000000000000000000000000000000000000000",
        "status": true,
        "to": "0x0000000000000000000000000000000000000012",
        "transactionHash": "0x1eff8db75a957a8ce80ac6f33cea0342365ef74d275c55eecde349bb47b837f1",
        "transactionIndex": 0
    }
   ```
   */
  async topUpChannel(receiverAddress, value) {
    return sendTx(this.web3, this.account, this.channelContract, 'topUp(address,uint32)', [receiverAddress, MockBlockNumber], value)
  }


  /**
   * @method
   * @desc 设置默认账户
   *
   * @param {string} private_key - 账户私钥
   * @returns {Promise<void>}
   */
  async setDefaultAccount(private_key) {
    let account = await this.web3.eth.accounts.privateKeyToAccount(privateKey)
    this.web3.eth.defaultAccount = account.address
  }


  /**
   * @method
   * @descri 根据私钥后去创建account信息，如果不传私钥则自动创建
   *
   * @param {string} private_key - 账户私钥
   * @returns {Promise<*>} - example json :
   ```json

   ```
   */
  async initAccount(private_key) {
    let account
    if (private_key === undefined && private_key == null) {
      account = await this.createAccount()
      console.log('-----------account 1----------', account.address)
    } else {
      account = await this.web3.eth.accounts.privateKeyToAccount(private_key)
      console.log('-----------account 2----------', account.address)
    }
    return account
  }


  /**
   * @method
   * @desc  生成私钥文件
   *
   * @param private_key - 账户私钥
   * @param dirNameFile - 所在项目根目录下的文件名 eg. '/mypath/key.json'
   * @returns {Promise<void>}
   */
  async generateKeyFile(private_key, dirNameFile) {
    let account
    if (private_key === undefined && private_key == null) {
      account = await this.createAccount()
      console.log('-----------account 1----------', account.address)
    } else {
      account = await this.web3.eth.accounts.privateKeyToAccount(private_key)
      console.log('-----------account 2----------', account.address)
    }
    let data = JSON.stringify(account)
    let outputFileName = appRootPath.concat(dirNameFile)
    console.log('------------outputFileName', outputFileName)
    console.log('------------generateKeyFile', data)
    fs.writeFile(outputFileName, JSON.stringify(data, null, 3), function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + outputFileName);
      }
    });
  }


  /**
   * @method
   * @desc 初始化调用通道
   *
   * @param dirNameFile - 私钥所在项目根路径名称（默认为JSON文件）
   * @param dbotAddress - DBot地址
   * @param private_key - 账户私钥
   * @param defaultTopup - 设置默认增加账户值，不传:10e18
   * @returns {Promise<*>}
   */
  async initConfig(dirNameFile, dbotAddress, private_key, defaultTopup) {
    if (defaultTopup === undefined) {
      defaultTopup = defaultDeposit
    } else {
      let bn = new BigNumber(1e18, 10)
      defaultTopup = bn.multipliedBy(defaultTopup).toString()
    }
    //1. 将私钥转换为账户
    let account
    if (private_key === undefined && private_key == null) {
      account = await this.createAccount()
      console.log('-----------account 1----------', account.address)
    } else {
      account = await this.web3.eth.accounts.privateKeyToAccount(private_key)
      console.log('-----------account 2----------', account.address)
    }
    let data = {
      key: account.privateKey
    }
    let outputFileName = appRootPath.concat(dirNameFile)
    console.log('------------outputFileName', outputFileName)
    console.log('------------generateKeyFile', data)
    fs.writeFile(outputFileName, JSON.stringify(data, null, 3), function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + outputFileName);
      }
    });
    //获取当前账户余额
    let balanace = await this.web3.eth.getBalance(account.address)
    const balanceBN = Web3.utils.toBN(balanace)
    const defaultDepositBN = Web3.utils.toBN(defaultTopup)
    // lt <
    if (balanace === 0 || balanceBN.lt(defaultDepositBN)) {
      return {
        status: 0,
        account: account,
        data: this.web3.utils.fromWei(balanace, 'ether'),
        msg: "You need get ether, url: https://faucet-test.atnio.net"
      }
    }
    // if channel exits , just topup the channel
    let channelDetail = await this.getChannelDetail(dbotAddress)
    if (channelDetail) {
      const topupResult = await this.topUpChannel(dbotAddress, defaultDepositBN.toString())
      return {
        status: 1,
        account: account,
        data: topupResult,
        msg: "topupChannel success"
      };
    }
    // 创建通道
    let CResult
    try {
      CResult = await this.createChannel(dbotAddress, balanceBN)
    } catch (e) {
      return {
        status: 0,
        msg: "create channel fail"

      }
    }
    return {
      status: 1,
      account: account,
      data: CResult,
      msg: "create channel success"
    };
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
   * @desc 签名Hash算法
   *
   * @param {string} hash - 需要签名的hash
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

  /**
   * @func
   * @desc 获取Balance的签名
   *
   * @param {string} receiverAddress - DBot地址
   * @param {string} balance - 需要签名的Balance
   * @returns {String}
   */
  signBalanceProof(receiverAddress, balance) {
    const data = this.getBalanceProofData(receiverAddress, balance)
    const hash = EthSignUtil.typedSignatureHash(data)
    return this.signMessage(hash)
  }


  /**
   * @method
   * @desc 获取DBot名称
   *
   * @param {string} dbotAddress - DBot地址
   * @returns {Promise<string>} - 返回DBot名称
   */
  async getDBotName(dbotAddress) {
    let dbotContract = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    return Web3.utils.hexToString(await dbotContract.methods.name().call())
  }

  /**
   * @method
   * @desc  获取DBot域名
   *
   * @param {string} dbotAddress - DBot地址
   * @returns {Promise<string>}
   */
  async getDBotDomain(dbotAddress) {
    let dbotContract = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    return Web3.utils.hexToString(await dbotContract.methods.domain().call())
  }

  /**
   * @method
   * @desc 获取DBot下的API的价格
   *
   * @param {string}  dbotAddress - DBot地址
   * @param {string}  uri - DBot下的指定API相对路径
   * @param {string}  method - DBot下的API请求方法类型
   * @returns {Promise<void>}
   */
  async getPrice(dbotAddress, uri, method) {
    let dbotContract = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    let key = await dbotContract.methods.getKey(Web3.utils.stringToHex(method), Web3.utils.stringToHex(uri)).call()
    let endpoint = await dbotContract.methods.keyToEndPoints(key).call()
    return endpoint.price
  }



  /**
   * @method
   * @descri 调用DBotServer AI服务
   *
   * @param {string} dbotAddress - DBot地址
   * @param {string} uri - DBot下的指定API相对路径
   * @param {string} method - DBot下的API请求方法类型
   * @param {object} option - option
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
   * @func
   * @desc callAPI
   *
   * @param {string} dbotAddress - DBot地址
   * @param {string} domain - DBot域名
   * @param {string} uri - EndPoint相对路径
   * @param {string} method - EndPoint请求类型
   * @param {object} option - 调用指定DBot需要的请求配置
   * @param {string | number} balance - 要签名的Balance
   * @param {string} blockNumber - 创建channel所在的块号
   * @returns {Promise<void>}
   */
  async callAPI(dbotAddress, domain, uri, method, option, balance, blockNumber) {
    option.url = `${this.handlerDBotDomain(domain, this.hyperProtocolType)}/call/${dbotAddress}${uri}`
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
   * @func
   * @desc 轮询查询交易信息，设置超时时间和确认块数
   *
   * @param {string} txHash - 交易hash值
   * @param {number} timeout - 每个块交易确认时间
   * @param {number} confirmations - 要确认的交易的块数
   *
   * @returns {Promise<{status: string, msg: string}> |  Promise<TransactionReceipt>} - json example :
   ```json
   {
     status:0,
     msg:"timeout"
   }
   ```
   ```json
   {
        "blockHash": "0x60a779ef28803a01bf825fb0d378e9e40edd9c33ef5d8379274d0fdfe4b1b451",
        "blockNumber": 400442,
        "contractAddress": null,
        "cumulativeGasUsed": 66603,
        "from": "0xa474a12b81b443854414c3c3928b0ec44adfde06",
        "gasUsed": 66603,
        "logs": [
            {
                "address": "0x0000000000000000000000000000000000000012",
                "topics": [
                    "0xa55ac5ebdb9bee5da90c5d4a6f104e5e2c116f97967ae2eb73f5fdfbdbb75bcb",
                    "0x000000000000000000000000a474a12b81b443854414c3c3928b0ec44adfde06",
                    "0x0000000000000000000000000aa602cb3a0919a95cb066b9d3ed99d391c395d5"
                ],
                "data": "0x00000000000000000000000000000000000000000000000029a2241af62c0000",
                "blockNumber": 400442,
                "transactionHash": "0x54168dfed7d0d1b3e5bac787b76ea490fd0c1b5e80674acdea4e241869462220",
                "transactionIndex": 0,
                "blockHash": "0x60a779ef28803a01bf825fb0d378e9e40edd9c33ef5d8379274d0fdfe4b1b451",
                "logIndex": 0,
                "removed": false,
                "id": "log_a4ba0d17"
            }
        ],
        "logsBloom": "0x00000000000000000000020000000000000000000000000000000000000010000000000000000000000000000000000000020000000000000000000000000400000000088000000000000000000000000000000000100000000000000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000800000000000002000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000400",
        "status": true,
        "to": "0x0000000000000000000000000000000000000012",
        "transactionHash": "0x54168dfed7d0d1b3e5bac787b76ea490fd0c1b5e80674acdea4e241869462220",
        "transactionIndex": 0
    }
   ```
   */
  async waitTx(txHash, timeout, confirmations) {
    console.log('-----------------hash------------', txHash)
    const blockStart = await this.web3.eth.getBlockNumber()
    const startTime = new Date().getTime()
    const endTime = startTime + timeout * (confirmations + 1)
    obj.startTime = startTime
    do {
      await this.asyncSleep(1e3)
      if (typeof obj === 'object') {
        const flag = obj.flag
        if (!flag) break
      }
      const [receipt, block] = await Promise.call([
        await this.web3.eth.getTransactionReceipt(txHash),
        await this.web3.eth.getBlockNumber()
      ])
      if (!receipt || !receipt.blockNumber) {
        console.log('Waiting tx..', block - blockStart)
      } else if (block - receipt.blockNumber < confirmations) {
        console.log('Waiting confirmations...', block - receipt.blockNumber)
      } else {
        return receipt
      }
      if (endTime < new Date().getTime()) {
        break
      }
    } while (true)
    return {status: "0", msg: "timeout"}
  }


  /**
   * @method
   * @desc 通过私钥获取账户信息
   *
   * @param {string} private_key - 账户私钥
   * @returns {Promise<Account>}
   */
  async privateKeyToAccount(private_key) {
    return this.web3.eth.accounts.privateKeyToAccount(private_key);
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
   * @method
   * @desc 创建账户
   *
   * @returns {Promise<Account>}
   */
  async createAccount() {
    return this.web3.eth.accounts.create();
  }

  /**
   * @method
   * @descri 从DBotServer服务获取Balance签名
   *
   * @param {string} receiverAddress - DBot地址
   * @param {string | BigNumber} balance - 需要签名的Balance
   * @returns {Promise<*>}
   */
  async requestCloseSignature(receiverAddress, balance) {
    let detail = await this.getChannelDetail(receiverAddress)
    const blockNumber = detail.open_block_number
    const from = this.account.address
    const URL = `${this.handlerDBotDomain(detail.domain, this.hyperProtocolType)}/api/v1/dbots/${receiverAddress}/channels/${from}/${blockNumber}`.toString()
    console.log('-----------getChannelDetail-----------', URL)
    let resp
    try {
      resp = await axios.delete(URL, {params: {balance: balance}})
      return resp.data.close_signature;
    } catch (e) {
      throw new Error('Get close signature error')
    }
  }


  /**
   * @method
   * @descri  DBotServer的domain适配
   *
   * @param {string} domain - DBot域名
   * @param hyperProtocolType - 默认协议类型http或https
   * @returns {string} - 返回适配之后的URL前缀
   */
  handlerDBotDomain(domain, hyperProtocolType) {
    const result = domain.toLowerCase().startsWith('http') ? domain : hyperProtocolType.concat('://').concat(domain)
    return result
  }


  /**
   * @func
   * @desc  设置当前现成休眠时间　
   *
   * @param {number} timeout - 设置等待时间
   * @returns {Promise<*>}
   */
  async asyncSleep(timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout))
  }


  /**
   * @func
   * @desc  获取Balance签名Scheme
   *
   * @param {string} receiverAddress - DBot地址
   * @param {string | BigNumber } balance - 要签名的Balance
   * @returns {object[]} - 返回Scheme数组
   */
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
