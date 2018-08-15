var Atn = require('../src/atn')

const privateKeyJson = require('../src/config/keystore')

const dataJson = require('./DataTestConfig')

describe('Atn Client NodeJS Test', function() {


  const privateKey = privateKeyJson.privateKey

  console.log('private privateKey:', privateKey)

  const atn = new Atn(privateKey)

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
  //     console.log('==========================Register1==============================')
  //
  //     // 0x6cD97BC621437E3BdE6D682E9051eb80576ee035
  //     var result = atn.register('0xbfd7773208befdf78b25f0aa3073acd957750d93')
  //     console.log('==========================Register2==============================')
  //     result.then(function(result) {
  //       console.log(result)
  //     })
  //   })


  it(' Method ,OpenChannel ', async function() {
    console.log('==========================OpenChannel1==============================')
    var receiveAddress = '0xbfd7773208befdf78b25f0aa3073acd957750d93'
    var senderAddr = '0x6cd97bc621437e3bde6d682e9051eb80576ee035'
    var value = 2000
    var result = atn.openChannel(receiveAddress, value, senderAddr)
    result.then(function(result) {
      console.log(result)
    })
  })


  // it('Method CloseChannel', async function() {
  //   console.log('==========================CloseChannel1==============================')
  //   var receiveAddress = '0xbfd7773208befdf78b25f0aa3073acd957750d93'
  //   var senderAddress = '0x6cd97bc621437e3bde6d682e9051eb80576ee035'
  //   var dbotAddress = '0xbfd7773208befdf78b25f0aa3073acd957750d93'
  //   var blockNumber = 15717
  //   var balance = 20
  //   var result = atn.closeChannel(receiveAddress, senderAddress, dbotAddress, blockNumber, balance)
  //   result.then(function(result) {
  //     console.log(result)
  //   })
  // })


  // it('DbotFactory Method ,CallAI', function() {
  //
  //   var dbotAddress = '0xa5cf63b0bbe721bb1c7559027d83d8d4e005e248'
  //   var method = 'post'
  //   var uri = '/facepp/v3/detect'
  //   var receiverAddress = ''
  //   var senderAddress = ''
  //   var blockNumber = ''
  //   var balance = 123
  //   var price = 123
  //   var from = ''
  //   var option = {}
  //
  //
  //   atn.callAI('', '', '')
  // })

})
