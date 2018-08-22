var Atn = require('../src/atn')

var Base64 = require('js-base64').Base64
const privateKeyJson = require('../src/config/keystore')

var axios = require('axios')
var iconv = require('iconv-lite')

const dataJson = require('./DataTestConfig')


describe('Atn Client NodeJS Test', function() {


  const privateKey = privateKeyJson.privateKey

  const atn = new Atn(privateKey)

  // const dbotAddr = '0x15d58205fe0f296a075bd6cd34cd27ae72dc33d7'
  // const dbotAddr = '0x7b91d26bc8ea5ad641c79c3932e5486e4066ff6b'
  // const dbotAddr = '0x7476a1511d366ebc7309c23156b6bb9612fdd272'
  // const dbotAddr = '0xdc008c9b99bbd0de276627613193cc5baa10c0ea'
  // const dbotAddr = '0x6f8782bf3fc27dd1b31baf11064eedf2b6fc0811'
  const dbotAddr = '0x8c0307c37b21984bdd5dced886d4aeeaeb877c14' //0x0ca4907b44d7c6c9de889536d26f18f848f175dc


  const senderAddr = '0x6cd97bc621437e3bde6d682e9051eb80576ee035'

  it('DbotFactory Method Test, AddAccount', function() {
    console.log('=======================AddAccount Test Start=================================')
    atn.setDefaultAccount(privateKey)
    console.log('=======================AddAccount Test End=================================')
  })


  it('Account Method Test, Get Default Account', function() {
    console.log('==========================Get Default Account Test Start==============================')
    const account = atn.getDefaultAccount()
    console.log('account:', account)
    console.log('==========================Get Default Account Test End==============================')

  })

  // it('DbotFactory Method Test, Register', async function() {
  //   var dbotAddress = '0x8c0307c37b21984bdd5dced886d4aeeaeb877c14'
  //   console.log('==========================Register Test Start==============================')
  //   var result = atn.register(dbotAddress)
  //
  //   result.then(function(result) {
  //     console.log(result)
  //   })
  //   console.log('==========================Register Test End==============================')
  // })

  //
  // it(' Method ,OpenChannel ', async function() {
  //   console.log('==========================OpenChannel Test Start==============================')
  //   var receiveAddress = '0x8c0307c37b21984bdd5dced886d4aeeaeb877c14'
  //   var value = 22000
  //   var result = new Promise(resolve => atn.openChannel(receiveAddress, value))
  //   result.then(function(value) {
  //     console.log('==========================OpenChannel Test Result', value.transactionHash)
  //   })
  //   console.log('==========================OpenChannel Test Result2')
  //   console.log('==========================OpenChannel Test End==============================')
  // })

  // it('Method CloseChannel', async function() {
  //   console.log('==========================CloseChannel Test Start==============================')
  //   var receiveAddress = dbotAddr
  //   var blockNumber = 2999
  //   var balance = 30
  //   var result = new Promise(resolve => atn.closeChannel(receiveAddress, sendAddr, dbotAddr, blockNumber, balance))
  //   result.then(function(value) {
  //     console.log('==========================CloseChannel Test Result', value)
  //   })
  //   console.log('==========================CloseChannel Test End==============================')
  // })

  // it('Method Get Banlance Sign', async function() {
  //   // receiverAddress, blockNumber, balance
  //   var receiveAddress = '0x254046d709e89beecce17effe136f3f34a324be1'
  //   var blockNumber = 25467
  //   var balance = 20
  //   var result = await atn.getBanlanceSign(receiveAddress, blockNumber, balance)
  //   console.log('Banlance Sign ', result)
  // })


  // it('Method  getChannelInfo', async function() {
  //   var senderAddress = senderAddr
  //   var receiverAddress = dbotAddr
  //   let blockNumber = 10
  //   var result = atn.getChannelInfo(senderAddress, receiverAddress, blockNumber)
  //   console.log('getChannelInfo', result)
  //
  // })


  // it('Method Topup', async function() {
  //   var receiverAddress = dbotAddr
  //   let blockNumber = 10
  //   var result = atn.topUp(senderAddr, receiverAddress, blockNumber)
  //   console.log('getChannelInfo', result)
  // })

  it('DbotFactory Method ,CallAPI', async function() {
    this.timeout(10000)

    atn.setDefaultAccount(privateKey)
    console.log('===================DbotFactory Method ,CallAI Test Start==========================')
    var domain = 'localhost:5000'
    var method = 'post'
    var uri = '/rpc/2.0/nlp/v1/lexer'
    // var uri = '/facepp/v3/detect'
    // var receiverAddress = dbotAddr
    var senderAddress = '0x6cD97BC621437E3BdE6D682E9051eb80576ee035'
    // var blockNumber = 135173
    // var balance = 330
    var price = 10
    // facepp/v3/detect
    const dbotAddress = '0x8c0307c37b21984bdd5dced886d4aeeaeb877c14'
    var response = await axios.get(`http://${domain}/api/v1/dbots/${dbotAddress}/channels/${senderAddress}`)
    // TODO should only one channel
    let channelInfo = response.data[0]
    console.log('Test ChannelInfo------------------------- ', channelInfo)
    let data = {
      'text': '百度是一家高科技公司'
    }
    var gbkBytes = iconv.encode(JSON.stringify(data), 'gbk')

    // dbotAddress, method, uri, receiverAddress, senderAddress, blockNumber, balance, price, option
    var option = {
      headers: { 'Content-Type': 'application/json' },
      responseEncoding: 'GBK',
      method: method,
      data: gbkBytes
    }
    console.log('params++++++++++++++++++++++++++', channelInfo['receiver'], channelInfo['open_block_number'], channelInfo['balance'] + price)
    // var balanceSig = await atn.getBanlanceSign(channelInfo['receiver'], channelInfo['open_block_number'], channelInfo['balance'] + price)
    // 0xcfaecdce8e0cb7829748a22384789b658bc00b6b6500f540aeb21285909d3c323d370aef18c3789145b9232c35055e5373bbb22214d03fce0c327a34cef8bab31b
    // console.log('balanceSig  Test -------------', balanceSig)
    // var result = atn.callAPI(dbotAddr, method, uri, option, channelInfo, price, balanceSig).then(function(response) {
    //   console.log(response.data)
    // }).catch(function(error) {
    //   console.log(error)
    // })

    var result = atn.callAPI(dbotAddress, method, uri, option).then(function(response) {
      console.log('Test result ----------------------', response.data)
    }).catch(function(error) {
      console.log(error)
    })
    console.log('result ================', result)
  })


  // it('DbotFactory Method ,CallAI', async function() {
  //   this.timeout(10000)
  //   console.log('===================DbotFactory Method ,CallAI==========================')
  //   // var dbotAddress = '0x23ec269f4f76145e97303cb6236e21b7c9df5e9d'
  //   var domain = 'localhost:5000'
  //   var method = 'post'
  //   var uri = '/rpc/2.0/nlp/v1/lexer'
  //   // var receiverAddress = dbotAddr
  //   var senderAddress = '0x6cd97bc621437e3bde6d682e9051eb80576ee035'
  //   var price = 10
  //   var response = await axios.get(
  //     `http://${domain}/api/v1/dbots/${dbotAddr}/channels/${senderAddress}`)
  //   // TODO should only one channel
  //   channelInfo = response.data[0]
  //   let data = {
  //     "text": "百度是一家高科技公司"
  //   }
  //   var gbkBytes = iconv.encode(JSON.stringify(data),'gbk');
  //   // dbotAddress, method, uri, receiverAddress, senderAddress, blockNumber, balance, price, option
  //   var option = {
  //     headers: { 'Content-Type': 'application/json'},
  //     responseEncoding: 'GBK',
  //     method: method,
  //     data: gbkBytes
  //   }
  //   var balanceSig = await atn.getBanlanceSign(channelInfo['receiver'], channelInfo['open_block_number'], channelInfo['balance'] + price)
  //   atn.newCallAI(dbotAddr, method, uri, option, channelInfo, price, balanceSig).then(function(response) {
  //     console.log(response.data)
  //   }).catch(function(error) {
  //     console.log(error)
  //   })
  //   return
  //   // var result = atn.newCallAI(dbotAddr, method, uri, receiverAddress, senderAddress, blockNumber, balance, price, option)
  //   console.log('result ================', result)
  // })


})
