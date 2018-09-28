"use strict"
let Web3 = require('web3')
let BigNumber =require('bignumber.js')
let assert = require('assert');
let sleep = require('sleep')
const Atn = require('../src/atn')
let DBot = require('../src/contracts/dbot/dbot.json')
let iconv = require('iconv-lite');

// -------------------------------------------
// Modify following lines before run test
const http_provider = 'http://0.0.0.0:8545'
const dbotAddress = '0x0000000000000000000000000000000000000000'
const dbotConfigPath = './profiles/baidu/nlp/'

const password = 'passwd'
// -------------------------------------------

let web3 = new Web3(http_provider)
const Config = require(dbotConfigPath + 'config.js')
const DbotProfile = require(dbotConfigPath + Config.dbot.profile)
// const account = web3.eth.accounts.decrypt(keystore, password)


// if (web3.eth.getCode(dbotAddress) != DBot.bytecode) {
//   console.error('The dbotAddress is not address of a DBot, set it before run test')
//   return
// }

describe('Atn Client NodeJS Test', function () {
  //
  // describe('#getDbotName()', function () {
  //   it('should return the dbot name on chain', async function () {
  //     let name = await atn.getDbotName(dbotAddress)
  //     assert.equal(name, DbotProfile.info.name)
  //   })
  // })
  //
  // describe('#getDbotDomain()', function () {
  //   it('should return the dbot domain on chain', async function () {
  //     let domain = await atn.getDbotDomain(dbotAddress)
  //     assert.equal(domain, DbotProfile.info.domain)
  //   })
  // })
  //
  // describe('#getPrice()', function () {
  //   it('should return the price of endpoint in the dbot on chain', async function () {
  //     DbotProfile.endpoints.forEach(async (ep) => {
  //       let price = await atn.getPrice(dbotAddress, ep.uri, ep.method)
  //       assert.equal(price, ep.price)
  //     })
  //   })
  // })
  //
  // describe('#getChallengePeriod()', function () {
  //   it('should return the challenge period of channel on chain', async function () {
  //     let period = await atn.getChallengePeriod()
  //     assert.equal(period, Config.channel.challengePeriod)
  //   })
  // })
  //
  // describe('#createChannel,#getChannelDeposit()', function () {
  //   let deposit = DbotProfile.endpoints['0'].price * 10
  //   it('create a new channel, should get the deposit', async function () {
  //     this.timeout(20000)
  //     let receipt = await atn.createChannel(dbotAddress, deposit)
  //     // TODO how to assert tx success
  //     let value = await atn.getChannelDeposit(dbotAddress)
  //     assert.equal(value, deposit)
  //   })
  //
  //   it('should not create a new channel towards the same dbot', async function () {
  //     this.timeout(20000)
  //     try {
  //       let receipt = await atn.createChannel(dbotAddress, deposit)
  //     } catch (e) {
  //       assert.equal(e.message, 'Channel has exist.')
  //     }
  //   })
  // })
  //
  // describe('#getChannelDetail()', function () {
  //   it('should return the detail of channel', async function () {
  //     this.timeout(30000)
  //     let receiverAddress = dbotAddress
  //     let channelInfo = await atn.getChannelInfo(receiverAddress)
  //     let channelDetail = await atn.getChannelDetail(receiverAddress)
  //
  //     // make sure create channel has been synced by dbot server
  //     let retryCnt = 4
  //     while (channelDetail == undefined && retryCnt > 0) {
  //         --retryCnt
  //         console.log('ChannelCreated has not synced by dbot server, retry in 5s')
  //         sleep.sleep(5)
  //         channelDetail = await atn.getChannelDetail(receiverAddress)
  //     }
  //
  //     assert(channelDetail != undefined)
  //     assert.equal(channelInfo['deposit'], channelDetail['deposit'])
  //     assert.equal(channelInfo['blockNumber'], channelDetail['open_block_number'])
  //   })
  // })
  //
  // describe('#callDbotApi()', function () {
  //   it('should return expected result', async function () {
  //     let resp = await atn.callDbotApi(
  //       dbotAddress,
  //       DbotProfile.endpoints[0].uri,
  //       DbotProfile.endpoints[0].method,
  //       Config.dbot.axios,
  //     )
  //     assert.equal(resp.status, 200)
  //     console.log(resp.data)
  //   })
  // })
  //
  // describe('#topUpChannel()', function () {
  //   it('top up the created channel, should return new deposit', async function () {
  //     this.timeout(30000)
  //     const receiverAddress = dbotAddress
  //     let info = await atn._getChannelInfo(receiverAddress)
  //     let oldDeposit = info['deposit']
  //     let topUpValue = oldDeposit
  //     let receipt = await atn.topUpChannel(receiverAddress, topUpValue)
  //     let newInfo = await atn.getChannelInfo(receiverAddress)
  //     let newDeposit = new BigNumber(oldDeposit).plus(new BigNumber(topUpValue))
  //     assert(newDeposit.eq(new BigNumber(newInfo['deposit'])))
  //   })
  // })
  //
  // describe('#requestCloseSignature(),#closeChannel()', function () {
  //
  //   it('should close channel success', async function () {
  //     this.timeout(40000)
  //
  //     const receiverAddress = dbotAddress
  //     let channelInfo = await atn.getChannelInfo(receiverAddress)
  //     let channelDetail = await atn.getChannelDetail(receiverAddress)
  //
  //     //make sure top up has been synced by dbot server
  //     let retryCnt = 3
  //     while (channelDetail.deposit != channelInfo.deposit && retryCnt > 0) {
  //         --retryCnt
  //         console.log('ChannelToppedUp up has not synced by dbot server, retry in 5s')
  //         sleep.sleep(5)
  //         channelDetail = await atn.getChannelDetail(receiverAddress)
  //     }
  //
  //     assert.equal(channelDetail.deposit, channelInfo.deposit)
  //     let detail = await atn.getChannelDetail(receiverAddress)
  //     let closeSig = await atn.requestCloseSignature(receiverAddress, detail['balance'])
  //     let receipt = await atn.closeChannel(receiverAddress, channelDetail.balance, closeSig)
  //     //TODO check tx is success, blance check after close channel
  //     console.log(receipt)
  //
  //   })
  // })
  
  // describe('#initConfig()',function () {
  //   it('should initConfig success',async function () {
  //     const dbotAddress="0xfd4f504f373f0af5ff36d9fbe1050e6300699230"
  //     const privateKey = "0xc4046f954b3ad367a930529550e2f92eab6c9436a486f522db17b4e6d588384c"
  //     const atn = new Atn(account.privateKey, http_provider)
  //     const result = atn.initConfig(dbotAddress,null,11)
  //
  //   });
  // })
  
  describe('decode ',function () {
    it('should ', function () {
      const targetStr = "\ufffd߿Ƽ\ufffd"
      const str = iconv.encode(targetStr, 'gbk').toString()
      console.log('str',str)


    });
  })
})
