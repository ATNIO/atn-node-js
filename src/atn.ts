import { AIParam, ChannelInfo, Dbot, EndPoint, MsgParam, MsgResponse } from '../typings/atn'

import { Account } from '../node_modules/@types/web3/eth/accounts.d'
import { AxiosPromise, AxiosRequestConfig } from 'axios'

const EthSignUtil = require('eth-sig-util')

const Web3 = require('web3')
const axios = require('axios')

const DbotJson = require('./contracts/dbot/dbot.json')
const DbotFactoryJson = require('./contracts/dbot/dbotFactory.json')
const TransferChannelJson = require('./contracts/channel/transferChannels.json')

/**
 * Convert a callback-based func to return a promise
 *
 * It'll return a function which, when called, will pass all received
 * parameters to the wrapped method, and return a promise which will be
 * resolved which callback data passed as last parameter
 *
 * @param obj  A object containing the method to be called
 * @param method  A method name of obj to be promisified
 * @returns  A method wrapper which returns a promise
 */
function promisify<T>(obj: any, method: string): (...args: any[]) => Promise<T> {
  return (...params) =>
    new Promise((resolve, reject) =>
      obj[method](...params, (err: any, res: any) => (err ? reject(err) : resolve(res)))
    )
}

/**
 * Encode strings and numbers as hex, left-padded, if required.
 *
 * 0x prefix not added,
 *
 * @param val  Value to be hex-encoded
 * @param zPadLength  Left-pad with zeroes to this number of characters
 * @returns  hex-encoded value
 */
function encodeHex(val: string | number, zPadLength?: number): string {
  /* Encode a string or number as hexadecimal, without '0x' prefix */
  if (typeof val === 'number') {
    val = val.toString(16)
  } else {
    val = Array.from(val)
      .map((char: string) =>
        char
          .charCodeAt(0)
          .toString(16)
          .padStart(2, '0')
      )
      .join('')
  }
  return val.padStart(zPadLength || 0, '0')
}

class Atn {
  readonly web3: any

  readonly dmc: any

  readonly dfmc: any

  readonly tcmc: any

  readonly decimals: number = 18

  dbotDefaultAddress: string = '0x0000000000000000000000000000000000000011'

  dbotFactoryDefaultAddress: string = '0x0000000000000000000000000000000000000011'

  tcmcDefaultAddress: string = '0x0000000000000000000000000000000000000012'

  // constructor(web3: string | { currentProvider: any } = 'ws://localhost:7576') {
  constructor(web3: string | { currentProvider: any } = 'http://localhost:8545') {
    this.web3 = new Web3()
    if (typeof web3 === 'string') {
      this.web3.setProvider(new this.web3.providers.HttpProvider(web3))
    } else if (web3.currentProvider) {
      this.web3.setProvider(web3.currentProvider)
    } else {
      throw new Error('Invalid web3 provider')
    }

    this.dmc = new this.web3.eth.Contract(DbotJson.abi, this.dbotDefaultAddress)

    this.dfmc = new this.web3.eth.Contract(DbotFactoryJson.abi, this.dbotFactoryDefaultAddress)
    // const channelMethod = new this.web3.eth.Contract(TransferChannels.abi,)
    this.tcmc = new this.web3.eth.Contract(TransferChannelJson.abi, this.tcmcDefaultAddress)
  }

  /**
   * @method Web3 Method - addAccount
   * @desc
   *
   * @param {string | Account} account
   */
  addAccount(account: string | Account) {
    this.web3.eth.accounts.wallet.add(account)
  }

  /**
   * @method DobotFactory Method - register
   * @desc
   *
   * @param {string} dbotAddress
   * @param {string} from
   * @returns {any}
   */
  register(dbotAddress: string, from: string): any {
    return this.dfmc.methods.register(dbotAddress).send({ from })
  }

  /**
   * @method DobotFactory Method - idToAddress
   * @desc
   *
   * @param {number} dbotId
   * @returns {any}
   */
  idToAddress(dbotId: number): any {
    return this.dfmc.methods.idToAddress(dbotId).call()
  }

  /**
   * @method Dbot Method - changeName
   * @desc
   *
   * @param {string} name
   * @param {string} dbotAddress
   * @param {string} from
   * @returns {any}
   */
  changeName(name: string, dbotAddress: string, from: string): any {
    const initialDbot = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    return initialDbot.methods.changeName(name).send({ from })
  }

  /**
   * @method Dbot Method - chagneDomain
   * @desc
   *
   * @param {string} domain
   * @param {string} dbotAddress
   * @param {string} from
   * @returns {any}
   */
  changeDomain(domain: string, dbotAddress: string, from: string): any {
    const initialDbot = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    return initialDbot.methods.changeDomain(domain).send({ from })
  }

  /**
   * @method Dbot Method - changeNameAndDomain
   * @descerr
   *
   * @param {string} name
   * @param {string} domain
   * @param {string} dbotAddress
   * @param {string} from
   * @returns {any}
   *
   */
  changeNameAndDomain(name: string, domain: string, dbotAddress: string, from: string): any {
    const initialDbot = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    return initialDbot.methods.changeNameAndDomain(name, domain).send({ from })
  }

  /**
   * @method Dbot Method - addEndPoint
   * @desc
   *
   * @param {string} action
   * @param {string} price
   * @param {string} uri
   * @param {string} dbotAddress
   * @param {string} from
   * @returns {any}
   */
  addEndPoint(action: string, price: string, uri: string, dbotAddress: string, from: string): any {
    const initialDbot = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    return initialDbot.methods.addEndPoint(action, price, uri).send({ from })
  }

  /**
   * @method Dbot Method - updateEndPoint
   * @desc
   *
   * @param {string} action
   * @param {string} price
   * @param {string} uri
   * @param {string} dbotAddress
   * @param {string} from
   * @returns {any}
   */
  updateEndPoint(
    action: string,
    price: string,
    uri: string,
    dbotAddress: string,
    from: string
  ): any {
    const initialDbot = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    return initialDbot.methods.updateEndPoint(action, price, uri).send({ from })
  }

  /**
   * @method Dbot Method - deleteEndPoint
   * @desc
   *
   * @param {string} action
   * @param {string} uri
   * @param {string} dbotAddress
   * @param {string} from
   * @returns {any}
   */
  deleteEndPoint(action: string, uri: string, dbotAddress: string, from: string): any {
    const initialDbot = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    return initialDbot.methods.deleteEndPoint(action, uri).send({ from })
  }

  // TODO Need Explore To Manage The Keys
  getEndPoint(dbotAddr: string, action: string, uri: string): any {
    const initialDbot = new this.web3.eth.Contract(DbotJson, dbotAddr)
    return initialDbot.methods.keyToEndPoints()
  }

  getVersion(from: string): any {
    return this.tcmc.methods.version().call({ from })
  }

  /**
   * @method TransferChannel Method - challengePeriod
   * @desc
   *
   * @param {string} from
   * @returns {any}
   */
  getChallengePeriod(transferChannelContract: string, from: string): any {
    const rmtc = new this.web3.eth.Contract(TransferChannelJson.abi, transferChannelContract)
    return rmtc.methods.challengePeriod().call({ from })
  }

  /**
   * @method TransferChannel Method - channel_deposit_bugbounty_limit
   * @desc
   *
   * @param {string} from
   * @returns {any}
   */
  getChannelDepositBugbountyLimit(transferChannelContract: string, from: string): any {
    const rmtc = new this.web3.eth.Contract(TransferChannelJson.abi, transferChannelContract)
    return rmtc.methods.channel_deposit_bugbounty_limit().call({ from })
  }

  /**
   * @method TransferChannel Method - ownerAddress
   * @desc
   *
   * @param {string} transferChannelContract
   * @returns {any}
   */
  getOwnerAddress(transferChannelContract: string): any {
    const rmtc = new this.web3.eth.Contract(TransferChannelJson.abi, transferChannelContract)
    return rmtc.methods.ownerAddress().call()
  }

  /**
   * @method TransferChannel Method - openChannel
   * @desc
   *
   * @param {string} receiverAddress (the dbot address)
   * @param {string} value
   * @param {string} from
   * @returns {any}
   */
  openChannel(receiverAddress: string, value: string, from: string): any {
    return this.tcmc.methods.createChannel(receiverAddress).send({ from, value })
  }

  /**
   * @method TransferChannel Method - getKey
   * @desc
   *
   * @param {string} senderAddress
   * @param {string} receiveAddress
   * @param {number} blockNumber
   * @param {string} from
   * @returns {Promise<any>}
   */
  getKey(senderAddress: string, receiveAddress: string, blockNumber: number, from: string): any {
    return this.tcmc.methods.getKey(senderAddress, receiveAddress, blockNumber).call()
  }

  /**
   * @method TransferChannel Method - GetChannels
   * @desc
   *
   * @param {string} channelKey
   * @param {string} from
   * @returns {any}
   */
  keyToChannel(channelKey: string, from: string): any {
    return this.tcmc.methods.channels(channelKey).call({ from })
  }

  /**
   * @method TransferChannel Method - getWithdrawbalance
   * @desc
   *
   * @param {string} key
   * @param {string} from
   * @returns {any}
   */
  getWithdrawbalance(key: string, from: string): any {
    return this.tcmc.methods.withdrawn_balances(key).call({ from })
  }

  async getBanlanceSign(
    receiverAddress: string,
    blockNumber: number,
    balance: number,
    from: string
  ): Promise<string> {
    const params = this.getBalanceProofSignatureParams(receiverAddress, blockNumber, balance)
    const hash = EthSignUtil.typedSignatureHash(params)
    const sig = await this.signMessage(hash, from)
    return sig
  }

  /**
   * @method TransferChannel Method - withdraw
   * @desc
   *
   * @param {number} blockNumber
   * @param {number} balance
   * @returns {PromiEvent<any>}
   */
  async withdraw(receiverAddress: string, blockNumber: number, balance: number, from: string) {
    const signature = this.getBanlanceSign(receiverAddress, blockNumber, balance, from)
    console.log('withdraw method start sig:' + signature)
    return this.tcmc.methods.withdraw(blockNumber, balance, signature).send({ from })
  }

  /**
   * Ask user for signing a string with (personal|eth)_sign
   *
   * @param msg  Data to be signed
   * @returns Promise to signature
   */
  async signMessage(msg: string, account: string): Promise<string> {
    const hex = msg.startsWith('0x') ? msg : '0x' + encodeHex(msg)
    const sig = await promisify<string>(this.web3.eth, 'sign')(hex, account)
    console.log('sig:' + hex)
    return sig
  }

  private getBalanceProofSignatureParams(
    receiverAddress: string,
    blockNumber: number,
    balance: number
  ): MsgParam[] {
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
        value: '' + balance
      },
      {
        type: 'address',
        name: 'contract',
        value: this.tcmcDefaultAddress
      }
    ]
  }

  /**
   * @method TransferChannel Method - closingRequests
   * @desc
   *
   * @param {string} key
   * @param {string} from
   * @returns {any}
   */
  getClosingRequests(key: string, from: string): any {
    return this.tcmc.methods.closing_requests(key).call({ from })
  }

  /**
   * @method TransferChannel Method - topUpChannel
   * @desc
   *
   * @param {string} receiverAddress
   * @param {number} blockNumber
   * @param {string} value
   * @param {string} from
   * @returns {any}
   */
  topUpChannel(receiverAddress: string, blockNumber: number, value: string, from: string): any {
    return this.tcmc.methods.topUp(receiverAddress, blockNumber).send({ from, value })
  }

  /**
   * @method TransferChannel Method - topUpdateDelegate
   * @desc
   *
   * @param {string} senderAddress
   * @param {string} receiverAddress
   * @param {number} blockNumber
   * @param {string} value
   * @param {string} from
   * @returns {PromiEvent<any>}
   */
  topUpdateDelegateChannel(
    senderAddress: string,
    receiverAddress: string,
    blockNumber: number,
    value: string,
    from: string
  ): any {
    return this.tcmc.methods
      .topUpDelegate(senderAddress, receiverAddress, blockNumber)
      .send({ from, value })
  }

  /**
   * @method TransferChannel Method - settleChannel
   * @desc
   *
   * @param {string} receiveAddress
   * @param {number} blockNumber
   * @param {string} from
   * @returns {PromiEvent<any>}
   */
  settleChannel(receiveAddress: string, blockNumber: number, from: string) {
    return this.tcmc.methods.settle(receiveAddress, blockNumber).send({ from })
  }

  /**
   * @method TransferChannel Method - uncooperativeClose
   * @desc
   *
   * @param {string} receiveAddress
   * @param {number} blockNumber
   * @param {number} balance
   * @param {string} from
   * @returns {PromiEvent<any>}
   */
  uncooperativeClose(receiveAddress: string, blockNumber: number, balance: number, from: string) {
    return this.tcmc.methods.uncooperativeClose(receiveAddress, blockNumber, balance).send({ from })
  }

  /**
   * @method TransferChannel Method - addTrustedContracts
   * @desc
   *
   * @param {string[]} contracts
   * @param {string} from
   * @returns {any}
   */
  addTrustedContracts(contracts: string[], from: string): any {
    return this.tcmc.methods.addTrustedContracts(contracts).send({ from })
  }

  /**
   * @method TransferChannel Method - removeTrustedContracts
   * @desc
   *
   * @param {string[]} contracts
   * @param {string} from
   * @returns {any}
   */
  removeTrustedContracts(contracts: string[], from: string): any {
    return this.tcmc.methods.removeTrustedContracts(contracts).send({ from })
  }

  // closeChannel(receiverAddress: string, sender: string, receiver: string, block: number, balance: number): any {
  //   return this.cmc.methods[arguments.callee.name](...arguments).send()
  // }

  /**
   * @method TransferChannel Method - getChannelInfo
   * @desc
   *
   * @param {string} senderAddress
   * @param {string} receiverAddress
   * @param {number} blockNumber
   * @param {string} from
   * @returns {PromiEvent<any>}
   */
  getChannelInfo(
    senderAddress: string,
    receiverAddress: string,
    blockNumber: number,
    from: string
  ): Promise<ChannelInfo> {
    return this.tcmc.methods
      .getChannelInfo(senderAddress, receiverAddress, blockNumber)
      .call({ from })
  }

  /**
   *
   * @param {string} dbotAddress
   * @param {string} receiverAddress
   * @param {string} senderAddress
   * @param {number} blockNumber
   * @param {number} balance
   * @param {number} price
   * @param {string} from
   * @param {AxiosRequestConfig} option
   * @param opt
   * @returns {Promise<string>}
   */
  async callAI(
    dbotAddress: string,
    method: string,
    uri: string,
    receiverAddress: string,
    senderAddress: string,
    blockNumber: number,
    balance: number,
    price: number,
    from: string,
    option: AxiosRequestConfig,
    opt?: boolean
  ) {
    // 1. 判断 EndPoint是否存在于链上  如果在验证通过，不再提示用户链上在自己的dbot上注册Endpoint信息
    let dbotContract
    // 2. dbot init first
    try {
      dbotContract = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    } catch (e) {
      const errMsg: string = 'CallAI ' + e.name + ':' + 'Init DbotContract Fail' + e.message
      console.log(errMsg)
      return new Promise<string>(resolve => {
        return resolve(errMsg)
      })
    }

    const dbotDomain = Web3.utils.hexToString(await dbotContract.methods.domain().call({ from }))
    const key = await dbotContract.methods
      .getKey(Web3.utils.stringToHex(method), Web3.utils.stringToHex(uri))
      .call({ from })

    console.log('CallAI Key', key)
    let endPoint

    try {
      endPoint = await dbotContract.methods.keyToEndPoints(key).call({ from })
      console.log('CallAI EndPoint', endPoint)
    } catch (e) {
      const errMsg: string = 'CallAI ' + e.name + ':' + 'Get EndPoint Fail' + e.message
      console.log(errMsg)
      return new Promise<string>(resolve => {
        return resolve(errMsg)
      })
    }
    const newBalance = balance + price
    console.log('CallAI Key', key)
    const dbotURL: string = `http://${dbotDomain}/call/${dbotAddress}/${uri}`
    // 将balance和price注册到请求头中
    option.headers.balance = newBalance
    option.headers.price = endPoint.price
    option.url = dbotURL
    return axios(option)
  }

  /***
   * for Test
   * @param {AxiosRequestConfig} option
   * @returns {Promise<void>}
   */
  async requestAxio(option: AxiosRequestConfig) {
    const url: string =
      'http:/localhost:5000/api/v1/dbots/0x961f1c5e79c6ea36ddbc0b66dd60aaab00210bbd/channels/0x6c7986a0c46815495e592b1afca62b157027ee65/933'
    let channelInfo
    try {
      channelInfo = await axios.get(url)
    } catch (e) {
      console.error(e.name, e.message)
    }
    console.log('channelInfo : ', channelInfo.data.last_signature)
  }

  /**
   * Health check for currently configured channel info
   *
   * @param channel  Channel to test. Default to [[channel]]
   * @returns  True if channel is valid, false otherwise
   */
  // isChannelValid(channel?: MicroChannel): boolean {
  //   if (!channel) {
  //     channel = this.channel;
  //   }
  //   if (!channel || !channel.receiver || !channel.block
  //     || !channel.proof || !channel.account) {
  //     return false;
  //   }
  //   return true;
  // }

  /**
   * reference https://github.com/ATNIO/AI_market_plan/wiki/implement-proposal
   *
   * DELETE /api/<version>/dbots/<dbot_address>/channels/0x5601ea8445a5d96eeebf89a67c4199fbb7a43fbb/3241642
   * @param {string} receiverAddress
   * @param {number} blockNumber
   * @param {number} balance
   * @returns {Promise<string>}
   */
  async closeChannel(
    receiverAddress: string,
    senderAddress: string,
    dbotAddress: string,
    blockNumber: number,
    balance: number,
    from: string
  ): Promise<string> {
    // const channelURL: string = 'http://localhost:5000/api/v1/dbots/' + dbotAddress + '/channels/' + senderAddress + '/' + blockNumber
    let dbotContract
    // 1. dbot init first
    try {
      dbotContract = new this.web3.eth.Contract(DbotJson.abi, dbotAddress)
    } catch (e) {
      const initDbotErrMsg: string =
        'CloseChannelMethod ' + e.name + ':' + 'Init DbotContract Fail' + e.message
      console.log(initDbotErrMsg)
      return new Promise<string>(resolve => {
        return resolve(initDbotErrMsg)
      })
    }
    // console.log('2. dbotContract:', dbotContract)

    const dbot = <Dbot>{}
    dbot.domain = Web3.utils.hexToString(await dbotContract.methods.domain().call({ from }))
    dbot.name = Web3.utils.hexToString(await dbotContract.methods.name().call({ from }))

    console.log('1. dbot addr' + dbot.addr)
    console.log('2. domain:' + dbot.domain)
    console.log('3. name:' + dbot.name)

    const url: string = `http://${
      dbot.domain
    }/api/v1/dbots/${dbotAddress}/channels/${senderAddress}/${blockNumber}`
    console.log('4. url:' + url)

    let closeSignChannel
    try {
      closeSignChannel = await axios.get(url)
      console.log('5. closeSignChannel  Data : ' + closeSignChannel.data)
    } catch (e) {
      const channelErrMsg: string =
        'CloseChannelMethod ' + e.name + ':' + 'Get ChannelInfo From DbotServer Fail' + e.message
      console.log(channelErrMsg)
      return new Promise<string>(resolve => {
        return resolve(channelErrMsg)
      })
    }

    const balanceSignature = await this.getBanlanceSign(receiverAddress, blockNumber, balance, from)
    console.log('6. balanceSignature: ' + balanceSignature)
    const closeSign = closeSignChannel.data.last_signature
    console.log('7. closeSign: ' + closeSign)

    try {
      const result = await this.tcmc.methods.cooperativeClose(
        receiverAddress,
        blockNumber,
        balance,
        balanceSignature,
        closeSign
      )
      console.log('8. result:' + result.data)
    } catch (e) {
      const errMsg: string = 'CooperativeClose' + e.name + ':' + 'Close Channel Fail' + e.message
      console.log(errMsg)
      return new Promise<string>(resolve => {
        return resolve(errMsg)
      })
    }

    console.log(
      'closeChannel===========================closeChannel===========================closeChannel==========================='
    )
    return new Promise<string>(resolve => {
      const successMsg = 'success'
      return resolve(successMsg)
    })
  }
}

export default Atn
