"use strict"
let Web3 = require('web3')
let BigNumber =require('bignumber.js')
let assert = require('assert');
let sleep = require('sleep')

let Atn = require('../src/atn')
const Config = require('./config.json')
const DbotProfile = require(Config.dbot.profile)

const keystore = require('./accounts/node01/keystore/UTC--2018-06-19T08-46-57.628797023Z--845c0aaba0dabd59115c0601b429e23ec713cc80')
const password = 'passwd'

let web3 = new Web3()
const account = web3.eth.accounts.decrypt(keystore, password)
const atn = new Atn(account.privateKey)


describe('Atn Client NodeJS Test', function () {
  describe('#getDbotName()', function () {
    it('should return the dbot name on chain', async function () {
      let name = await atn.getDbotName(Config.dbot.address)
      assert.equal(name, DbotProfile.info.name)
    })
  })

  describe('#getDbotDomain()', function () {
    it('should return the dbot domain on chain', async function () {
      let domain = await atn.getDbotDomain(Config.dbot.address)
      assert.equal(domain, DbotProfile.info.domain)
    })
  })

  describe('#getPrice()', function () {
    it('should return the price of endpoint in the dbot on chain', async function () {
      DbotProfile.endpoints.forEach(async (ep) => {
        let price = await atn.getPrice(Config.dbot.address, ep.uri, ep.method)
        assert.equal(price, ep.price)
      })
    })
  })

  describe('#getChallengePeriod()', function () {
    it('should return the challenge period of channel on chain', async function () {
      let period = await atn.getChallengePeriod()
      assert.equal(period, Config.channel.challengePeriod)
    })
  })

  describe('#createChannel,#getChannelDeposit()', function () {
    let deposit = DbotProfile.endpoints['0'].price * 10
    it('create a new channel, should get the deposit', async function () {
      this.timeout(15000)
      let receipt = await atn.createChannel(Config.dbot.address, deposit)
      // TODO how to assert tx success
      let value = await atn.getChannelDeposit(Config.dbot.address)
      assert.equal(value, deposit)
    })

    it('should not create a new channel towards the same dbot', async function () {
      this.timeout(15000)
      try {
        let receipt = await atn.createChannel(Config.dbot.address, deposit)
      } catch (e) {
        assert.equal(e.message, 'Channel has exist.')
      }
    })
  })

  describe('#getChannelDetail()', function () {
    it('should return the detail of channel', async function () {
      this.timeout(20000)
      let receiverAddress = Config.dbot.address
      let channelInfo = await atn._getChannelInfo(receiverAddress)
      let channelDetail = await atn.getChannelDetail(receiverAddress)

      // make sure create channel has been synced by dbot server
      let retryCnt = 3
      while (channelDetail == undefined && retryCnt > 0) {
          --retryCnt
          console.log('ChannelCreated has not synced by dbot server, retry in 5s')
          sleep.sleep(5)
          channelDetail = await atn.getChannelDetail(receiverAddress)
      }

      assert(channelDetail != undefined)
      assert.equal(channelInfo['deposit'], channelDetail['deposit'])
      assert.equal(channelInfo['blockNumber'], channelDetail['open_block_number'])
    })
  })

  describe('#callDbotApi()', function () {
    it('should return expected result', async function () {
      let resp = await atn.callDbotApi(
        Config.dbot.address,
        DbotProfile.endpoints[0].uri,
        DbotProfile.endpoints[0].method,
        Config.dbot.axios,
      )
      assert.equal(resp.status, 200)
    })
  })

  describe('#topUpChannel()', function () {
    it('top up the created channel, should return new deposit', async function () {
      this.timeout(15000)
      const receiverAddress = Config.dbot.address
      let info = await atn._getChannelInfo(receiverAddress)
      let oldDeposit = info['deposit']
      let topUpValue = oldDeposit
      let receipt = await atn.topUpChannel(receiverAddress, topUpValue)
      let newInfo = await atn._getChannelInfo(receiverAddress)
      let newDeposit = new BigNumber(oldDeposit).plus(new BigNumber(topUpValue))
      assert(newDeposit.eq(new BigNumber(newInfo['deposit'])))
    })
  })

  describe('#requestCloseSignature(),#closeChannel()', function () {

    it('should close channel success', async function () {
      this.timeout(30000)

      const receiverAddress = Config.dbot.address
      let channelInfo = await atn._getChannelInfo(receiverAddress)
      let channelDetail = await atn.getChannelDetail(receiverAddress)

      //make sure top up has been synced by dbot server
      let retryCnt = 3
      while (channelDetail.deposit != channelInfo.deposit && retryCnt > 0) {
          --retryCnt
          console.log('ChannelToppedUp up has not synced by dbot server, retry in 5s')
          sleep.sleep(5)
          channelDetail = await atn.getChannelDetail(receiverAddress)
      }

      assert.equal(channelDetail.deposit, channelInfo.deposit)
      let detail = await atn.getChannelDetail(receiverAddress)
      let closeSig = await atn.requestCloseSignature(receiverAddress, detail['balance'])
      let receipt = await atn.closeChannel(receiverAddress, channelDetail.balance, closeSig)
      //TODO check tx is success, blance check after close channel
      console.log(receipt)

    })

  })
})
