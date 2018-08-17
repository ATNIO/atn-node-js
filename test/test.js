var Atn = require('../src/atn')

var Base64 = require('js-base64').Base64
const privateKeyJson = require('../src/config/keystore')

var Axio = require('axios')

const dataJson = require('./DataTestConfig')


describe('Atn Client NodeJS Test', function() {


  const privateKey = privateKeyJson.privateKey

  console.log('private privateKey:', privateKey)

  const atn = new Atn(privateKey)

  const dbotAddr = '0x254046d709e89beecce17effe136f3f34a324be1'

  it('DbotFactory Method Test, AddAccount', function() {
    console.log('=======================AddAccount=================================')
    atn.setDefaultAccount(privateKey)
  })


  it('Account Method Test, Get Default Account', function() {
    console.log('==========================Get Default Account==============================')
    const account = atn.getDefaultAccount()
    console.log('account:', account)
  })

  it('DbotFactory Method Test, Register', async function() {
    console.log('==========================Register1==============================')


    var result = atn.register(dbotAddr)
    console.log('==========================Register2==============================')
    result.then(function(result) {
      console.log(result)
    })
  })

  //
  // it(' Method ,OpenChannel ', async function() {
  //   console.log('==========================OpenChannel1==============================')
  //   var receiveAddress = '0x3f443c0df451d651220b5bb73c15588d49b4fa1b'
  //   console.log('dbotAddr: ', dbotAddr)
  //   var senderAddr = '0x6cd97bc621437e3bde6d682e9051eb80576ee035'
  //   var value = 22000
  // var result = atn.openChannel(receiveAddress, value, senderAddr)
  // result.then(function(result) {
  //   console.log(result)
  // })


  // it('Method CloseChannel', async function() {
  //   console.log('==========================CloseChannel1==============================')
  //   var receiveAddress = '0x254046d709e89beecce17effe136f3f34a324be1'
  //   var senderAddress = '0x6cd97bc621437e3bde6d682e9051eb80576ee035'
  //   var dbotAddress = '0x254046d709e89beecce17effe136f3f34a324be1'
  //   var blockNumber = 25467
  //   var balance = 20
  // var result = atn.closeChannel(receiveAddress, senderAddress, dbotAddress, blockNumber, balance)
  // result.then(function(result) {
  //   console.log(result.transactionHash)
  // })
  // })

  // it('Method Get Banlance Sign', async function() {
  //   // receiverAddress, blockNumber, balance
  //   var receiveAddress = '0x254046d709e89beecce17effe136f3f34a324be1'
  //   var blockNumber = 25467
  //   var balance = 20
  //   var result = await atn.getBanlanceSign(receiveAddress, blockNumber, balance)
  //   console.log('Banlance Sign ', result)
  // })


  it('Method  getChannelInfo', async function() {

  })


  // it('DbotFactory Method ,CallAI', function() {
  //   console.log('===================DbotFactory Method ,CallAI==========================')
  //   var dbotAddress = '0x23ec269f4f76145e97303cb6236e21b7c9df5e9d'
  //   var method = 'post'
  //   var uri = '/facepp/v3/detect'
  //   var receiverAddress = '0x23ec269f4f76145e97303cb6236e21b7c9df5e9d'
  //   var senderAddress = '0x6cd97bc621437e3bde6d682e9051eb80576ee035'
  //   var blockNumber = 28675
  //   var balance = 10
  //   var price = 10
  //   var from = '0x6cd97bc621437e3bde6d682e9051eb80576ee035'
  //   let data = {
  //     'image_url': 'https://www.faceplusplus.com.cn/scripts/demoScript/images/demo-pic1.jpg',
  //     'return_landmark': 1,
  //     'return_attributes': 'gender,age'
  //   }
  //   // dbotAddress, method, uri, receiverAddress, senderAddress, blockNumber, balance, price, option
  //   var option = {
  //     headers: { 'X-Requested-With': 'XMLHttpRequest' },
  //     data: {
  //       'image_url': 'https://www.faceplusplus.com.cn/scripts/demoScript/images/demo-pic1.jpg',
  //       'return_landmark': 1,
  //       'return_attributes': 'gender,age'
  //     }
  //   }
  //   var result = atn.callAI(dbotAddress, method, uri, receiverAddress, senderAddress, blockNumber, balance, price, option)
  //   console.log('result ================', result)
  // })

})
