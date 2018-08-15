const _ = require('underscore')
const Tx = require('ethereumjs-tx')
const gasConfig = require('./config/config')

var getWallet = function(from, accounts) {
  console.log('getWallet from:', from)
  var wallet = null
  if (_.isNumber(from)) {
    wallet = accounts.wallet[from]
  } else if (_.isObject(from) && from.address && from.privateKey) {
    wallet = from
  } else {
    console.log('getWallet', from)
    wallet = accounts.wallet[from]
  }
  return wallet
}


module.exports = async (web3, contract, method, params, value) => {
  let wallet = getWallet(web3.eth.defaultAccount, web3.eth.accounts)
  console.log('default account', web3.eth.defaultAccount)
  if (wallet && wallet.privateKey) {
    console.log('callData', params)
    console.log('method', method)
    const callData = contract.methods[method](...params).encodeABI()

    const rawTx = {
      value: value,
      gasPrice: gasConfig.gasPrice,
      gasLimit: gasConfig.gasLimit,
      to: contract.options.address,
      data: callData
    }
    let sign = await web3.eth.accounts.signTransaction(rawTx, wallet.privateKey)
    const receipt = web3.eth.sendSignedTransaction(sign.rawTransaction)
    return receipt
  } else {
    throw new Error('wallet is required')
  }
}
