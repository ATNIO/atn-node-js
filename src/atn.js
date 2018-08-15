const sendTx = require('./sendTx')
const EthSignUtil = require('eth-sig-util')
const Web3 = require('web3')
const axios = require('axios')


privateKeyJson = require('./config/keystore')
const DbotJson = require('./contracts/dbot/dbot.json')
const DbotFactoryJson = require('./contracts/dbot/dbotFactory.json')
const TransferChannelJson = require('./contracts/channel/transferChannels.json')
const gasConfig = require('./config/config')

var atnObject = require('../typings/atn-objects')


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

    this.senderAccount = this.web3.eth.accounts.privateKeyToAccount('0x' + this.private_key)

    this.web3.eth.accounts.wallet.add(this.senderAccount)


  }


  num2bal(value) {
    return Math.floor(value * Math.pow(10, this.decimals))
  }

  bal2num(bal) {
    return bal && bal.div ?
      bal.div(Math.pow(10, this.decimals)) :
      bal / Math.pow(10, this.decimals)
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
  register(dbotAddress) {
    return sendTx(this.web3, this.dfmc, 'register(address)', [dbotAddress])
  }


  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param dbotId
   * @returns {Promise<*>}
   */
  idToAddress(dbotId) {
    return sendTx(this.web3, this.dfmc, 'idToAddress', [dbotId], null)
  }


  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param name
   * @param dbotAddress
   * @param from
   * @returns {Promise<*>}
   */
  changeName(name, dbotAddress, from) {
    this.setDefaultAccount(from)
    const initialDbot = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    return sendTx(this.web3, initialDbot, 'changeName', [name], null)
  }

  /**
   *
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param domain
   * @param dbotAddress
   * @param from
   * @returns {Promise<*>}
   */
  changeDomain(domain, dbotAddress, from) {
    this.setDefaultAccount(from)
    const initialDbot = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    return sendTx(this.web3, initialDbot, 'changeDomain', [domain], null)
  }

  // changeNameAndDomain(name  , domain  , dbotAddress  , from  )  {
  //   const initialDbot = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
  //   return initialDbot.methods.changeNameAndDomain(name, domain).send({ from })
  // }


  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param action
   * @param price
   * @param uri
   * @param dbotAddress
   * @param from
   * @returns {Promise<*>}
   */
  addEndPoint(action, price, uri, dbotAddress, from) {
    this.setDefaultAccount(from)
    const initialDbot = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    return sendTx(this.web3, initialDbot, 'addEndPoint', [action, price, uri], null)
  }


  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param action
   * @param price
   * @param uri
   * @param dbotAddress
   * @param from
   * @returns {Promise<*>}
   */
  updateEndPoint(action, price, uri, dbotAddress, from) {
    this.setDefaultAccount(from)
    const initialDbot = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    return sendTx(this.web3, initialDbot, 'updateEndPoint', [action, price, uri], null)
  }

  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param action
   * @param uri
   * @param dbotAddress
   * @param from
   * @returns {Promise<*>}
   */
  deleteEndPoint(action, uri, dbotAddress, from) {
    this.setDefaultAccount(from)
    const initialDbot = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    return sendTx(this.web3, initialDbot, 'deleteEndPoint', [action, uri])
  }

  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param from
   * @returns {Promise<*>}
   */
  getVersion(from) {
    this.setDefaultAccount(from)
    return sendTx(this.web3, this.tcmc, 'version')
  }

  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param transferChannelContract
   * @param from
   * @returns {Promise<*>}
   */
  getChallengePeriod(transferChannelContract, from) {
    this.setDefaultAccount(from)
    const rmtc = new this.web3.eth.Contract(TransferChannelJson.abi, transferChannelContract)
    return sendTx(this.web3, rmtc, 'challengePeriod')
  }

  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param transferChannelContract
   * @returns {Promise<*>}
   */
  getOwnerAddress(transferChannelContract) {
    const rmtc = new this.web3.eth.Contract(TransferChannelJson.abi, transferChannelContract)
    return sendTx(this.web3, rmtc, 'ownerAddress', [])
  }


  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param senderAddress
   * @param receiveAddress
   * @param blockNumber
   * @param from
   * @returns {Promise<*>}
   */
  getKey(senderAddress, receiveAddress, blockNumber, from) {
    this.setDefaultAccount(from)
    return sendTx(this.web3, this.tcmc, 'getKey', [senderAddress, receiveAddress, blockNumber])
  }


  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param channelKey
   * @param from
   * @returns {Promise<*>}
   */
  keyToChannel(channelKey, from) {
    this.setDefaultAccount(from)
    return sendTx(this.web3, this.tcmc, 'channels', [channelKey])
  }


  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param transferChannelContract
   * @param from
   * @returns {Promise<*>}
   */
  getChannelDepositBugbountyLimit(transferChannelContract, from) {
    this.setDefaultAccount(from)
    const rmtc = new this.web3.eth.Contract(TransferChannelJson.abi, transferChannelContract)
    return sendTx(this.web3, rmtc, 'channel_deposit_bugbounty_limit')
  }

  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param key
   * @param from
   * @returns {Promise<*>}
   */
  getWithdrawbalance(key, from) {
    this.setDefaultAccount(from)
    return sendTx(this.web3, rmtc, 'withdrawn_balances', [key])
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
  async getBanlanceSign(receiverAddress, blockNumber, balance, from) {
    const params = this.getBalanceProofSignatureParams(receiverAddress, blockNumber, balance)
    const hash = EthSignUtil.typedSignatureHash(params)
    const sig = await this.signMessage(hash, from)
    return sig
  }

  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param receiverAddress
   * @param blockNumber
   * @param balance
   * @param from
   * @returns {Promise<*>}
   */
  async withdraw(receiverAddress, blockNumber, balance, from) {
    const signature = this.getBanlanceSign(receiverAddress, blockNumber, balance, from)
    console.log('withdraw method start sig:' + signature)
    this.setDefaultAccount(from)
    return sendTx(this.web3, rmtc, 'withdraw', [blockNumber, balance, signature])
  }

  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param msg
   * @param account
   * @returns {Promise<boolean>}
   */
  async signMessage(msg, account) {
    const hex = msg.startsWith('0x') ? msg : '0x' + encodeHex(msg)
    const sig = await this.web3.eth.sign(hex, account)
    console.log('signMessage:' + hex)
    return sig
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
  getClosingRequests(key, from) {
    this.setDefaultAccount(from)
    return sendTx(this.web3, this.tcmc, 'closing_requests', [key])
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
  topUpChannel(receiverAddress, blockNumber, value, from) {
    this.setDefaultAccount(from)
    return sendTx(this.web3, this.tcmc, 'topUp', [receiverAddress, blockNumber])
    // return this.tcmc.methods.topUp(receiverAddress, blockNumber).send({ from, value })
  }

  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param senderAddress
   * @param receiverAddress
   * @param blockNumber
   * @param value
   * @param from
   * @returns {Promise<*>}
   */
  topUpdateDelegateChannel(senderAddress, receiverAddress, blockNumber, value, from) {
    this.setDefaultAccount(from)
    return sendTx(this.web3, this.tcmc, 'topUpDelegate', [senderAddress, receiverAddress, blockNumber])
    // return this.tcmc.methods.topUpDelegate(senderAddress, receiverAddress, blockNumber).send({ from, value })
  }


  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param receiveAddress
   * @param blockNumber
   * @param from
   * @returns {Promise<*>}
   */
  settleChannel(receiveAddress, blockNumber, from) {
    this.setDefaultAccount(from)
    return sendTx(this.web3, this.tcmc, 'settle', [receiveAddress, blockNumber])
    // return this.tcmc.methods.settle(receiveAddress, blockNumber).send({ from })
  }


  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param senderAddress
   * @param receiverAddress
   * @param blockNumber
   * @param from
   * @returns {Promise<*>}
   */
  getChannelInfo(senderAddress, receiverAddress, blockNumber, from) {
    this.setDefaultAccount(from)
    return sendTx(this.web3, this.tcmc, 'getChannelInfo', [senderAddress, receiverAddress, blockNumber])
  }


  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param dbotAddress
   * @param method
   * @param uri
   * @param receiverAddress  Channel Address
   * @param senderAddress    User Address
   * @param blockNumber
   * @param balance
   * @param price
   * @param from
   * @param option
   * @param opt
   * @returns {Promise<*>}
   */
  async callAI(dbotAddress, method, uri, receiverAddress, senderAddress, blockNumber, balance, price, from, option) {
    // 1. 判断 EndPoint是否存在于链上  如果在验证通过，不再提示用户链上在自己的dbot上注册Endpoint信息
    let dbotContract
    this.setDefaultAccount(from)
    // 2. dbot init first
    try {
      dbotContract = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    } catch (e) {
      const errMsg = 'CallAI ' + e.name + ':' + 'Init DbotContract Fail' + e.message
      console.log(errMsg)
      return new Promise < String > (resolve => {
        return resolve(errMsg)
      })
    }

    const dbotDomain = Web3.utils.hexToString(await dbotContract.methods.domain().call({ from }))
    // const key = await dbotContract.methods.getKey(Web3.utils.stringToHex(method), Web3.utils.stringToHex(uri)).call({ from })
    const key = sendTx(this.web3, dbotContract, 'getKey', [Web3.utils.stringToHex(method), Web3.utils.stringToHex(uri)])
    console.log('CallAI Key', key)
    let endPoint
    try {
      endPoint = sendTx(this.web3, dbotContract, 'keyToEndPoints', [key])
      console.log('CallAI EndPoint', endPoint)
    } catch (e) {
      const errMsg = 'CallAI ' + e.name + ':' + 'Get EndPoint Fail' + e.message
      console.log(errMsg)
      return new Promise < String > (resolve => {
        return resolve(errMsg)
      })
    }
    const newBalance = balance + price
    console.log('CallAI Key', key)
    const dbotURL = `http://${dbotDomain}/call/${dbotAddress}/${uri}`
    // 将balance和price注册到请求头中
    option.headers.balance = newBalance
    option.headers.price = endPoint.price
    option.url = dbotURL
    return axios(option)
  }


  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param receiverAddress  (dbotAddress)
   * @param value
   * @param from
   * @returns {*}
   */
  async openChannel(receiverAddress, value, from) {
    var dbotWeb3 = new this.web3.eth.Contract(DbotJson.abi, receiverAddress)

    var domain = Web3.utils.hexToString(await dbotWeb3.methods.domain().call({ from: receiverAddress }))
    var url = `http://${domain}/api/v1/dbots/${receiverAddress}/channels/${from}`
    console.log('open Channel url', url)
    let channelInfo
    try {
      channelInfo = await axios.get(url)
    } catch (e) {
      console.error(e.name, e.message)

    }
    //请求dbot服务器地址，判断channel是否存在
    if (channelInfo.status == 200) {
      console.log('channelInfo.data.length ', channelInfo.data.length)
      if (channelInfo.data === '[]') {
        console.log('sendTx start')
        return sendTx(this.web3, this.tcmc, 'createChannel(address)', [receiverAddress], value)
      } else {
        throw new Error('Channel has exist')
      }
    } else {
      throw new Error('OpenChannel Method:Error response from dbot server')
    }
  }

  async closeChannel(receiverAddress, senderAddress, dbotAddress, blockNumber, balance) {

    var dbotWeb3 = new this.web3.eth.Contract(DbotJson.abi, receiverAddress)
    var domain = Web3.utils.hexToString(await dbotWeb3.methods.domain().call({ from: receiverAddress }))
    const url = `http://${domain}/api/v1/dbots/${dbotAddress}/channels/${senderAddress}/${blockNumber}`
    let closeSignChannelInfo
    try {
      closeSignChannelInfo = await axios.get(url)
    } catch (e) {
      console.error(e.name, e.message)
    }
    if (closeSignChannelInfo.status == 200) {

      console.log('this.web3.defaultAccount',this.web3.eth.defaultAccount)
      // 0x6a27ef8b333bbebcd0972c35ed5f2fbb403ca0041f87ed0d035b47d9c2732eac7825ddb226a8044c168e26b02045bafbc4cafa6a3139c442678a4363cebba6ee1b
      let balanceSignature = await this.getBanlanceSign(receiverAddress, blockNumber, balance, this.web3.eth.defaultAccount)
      console.log('balanceSignature : ', balanceSignature)
      let closeSignature = closeSignChannelInfo.data.last_signature
      // 0x6a27ef8b333bbebcd0972c35ed5f2fbb403ca0041f87ed0d035b47d9c2732eac7825ddb226a8044c168e26b02045bafbc4cafa6a3139c442678a4363cebba6ee1b
      // 0x9e476120f257dc230629f08d964833d6dfd083b9c91b36bad263feda2fc3dcbf4d2c4b371034a24588d31b8b8255a2d66ebecbcb96a5b47a36bb84866c3e1fd31b
      console.log('closeSignChannel : ', closeSignature)
      const result = sendTx(this.web3, this.tcmc, 'cooperativeClose(address,uint32,uint256,bytes,bytes)', ['0xBFd7773208bEFDf78b25F0aA3073AcD957750d93', blockNumber, balance, balanceSignature, closeSignature])
      return result
    } else {
      throw new Error('CloseChannel Method:Error response from dbot server')
    }

  }

}






