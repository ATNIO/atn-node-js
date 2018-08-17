var Atn = require('../src/atn')

const privateKeyJson = require('../src/config/keystore')

var axios = require('axios')
var iconv = require("iconv-lite");

const dataJson = require('./DataTestConfig')


describe('Atn Client NodeJS Test', function() {


  const privateKey = privateKeyJson.privateKey

  console.log('private privateKey:', privateKey)

  const atn = new Atn(privateKey)

  const dbotAddr = '0x5d4bc022d427df512d6772df00c61c7bdcb70737'

  it('DbotFactory Method Test, AddAccount', function() {
    console.log('=======================AddAccount=================================')
    atn.setDefaultAccount(privateKey)
  })


  it('Account Method Test, Get Default Account', function() {
    console.log('==========================Get Default Account==============================')
    const account = atn.getDefaultAccount()
    console.log('account:', account)
  })

  // it('DbotFactory Method Test, Register', async function() {
  //   console.log('==========================Register1==============================')
  // 0x6cD97BC621437E3BdE6D682E9051eb80576ee035
  // var result = atn.register('0x23ec269f4f76145e97303cb6236e21b7c9df5e9d')
  // console.log('==========================Register2==============================')
  //   result.then(function(result) {
  //     console.log(result)
  //   })
  // })

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


  it('DbotFactory Method ,CallAI', async function() {
    this.timeout(10000)
    console.log('===================DbotFactory Method ,CallAI==========================')
    // var dbotAddress = '0x23ec269f4f76145e97303cb6236e21b7c9df5e9d'
    var domain = 'localhost:5000'
    var method = 'post'
    var uri = '/rpc/2.0/nlp/v1/lexer'
    // var receiverAddress = dbotAddr
    var senderAddress = '0x6c7986a0c46815495e592b1afca62b157027ee65'
    // var blockNumber = 135173
    // var balance = 330
    var price = 10

    var response = await axios.get(
      `http://${domain}/api/v1/dbots/${dbotAddr}/channels/${senderAddress}`)
    // TODO should only one channel
    channelInfo = response.data[0]

    let data = {
        "text": "百度是一家高科技公司"
    }
    var gbkBytes = iconv.encode(JSON.stringify(data),'gbk');

    // dbotAddress, method, uri, receiverAddress, senderAddress, blockNumber, balance, price, option
    var option = {
        headers: { 'Content-Type': 'application/json'},
        responseEncoding: 'GBK',
        method: method,
        data: gbkBytes
    }
    var balanceSig = await atn.getBanlanceSign(channelInfo['receiver'], channelInfo['open_block_number'], channelInfo['balance'] + price)
    atn.newCallAI(dbotAddr, method, uri, option, channelInfo, price, balanceSig).then(function(response) {
        console.log(response.data)
    }).catch(function(error) {
        console.log(error)
    })
    return
    var result = atn.callAI(dbotAddr, method, uri, receiverAddress, senderAddress, blockNumber, balance, price, option)
    console.log('result ================', result)
  })

})
