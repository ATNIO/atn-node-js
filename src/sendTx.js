const _ = require('underscore')
const Tx = require('ethereumjs-tx')
const gasConfig = require('./config/config')

var getWallet = function(from, accounts) {
  var wallet = null
  if (_.isNumber(from)) {
    wallet = accounts.wallet[from]
  } else if (_.isObject(from) && from.address && from.privateKey) {
    wallet = from
  } else {
    wallet = accounts.wallet[from]
  }
  return wallet
}


module.exports = async (web3, contract, method, params, value) => {
  let wallet = getWallet(web3.eth.defaultAccount, web3.eth.accounts)
  console.log('==========================SendTx start==============================\n')
  if (wallet && wallet.privateKey) {
    console.log('sendTx---------accounts', web3.eth.defaultAccount)
    console.log('sendTx---------method', method)
    console.log('sendTx---------params', params)
    const callData = contract.methods[method](...params).encodeABI()
    const rawTx = {
      value: value,
      gasPrice: gasConfig.gasPrice,
      gasLimit: gasConfig.gasLimit,
      to: contract.options.address,
      data: callData
    }
    console.log('wallet.privateKey :', wallet.privateKey)
    let sign = await web3.eth.accounts.signTransaction(rawTx, wallet.privateKey)
    const receipt = await web3.eth.sendSignedTransaction(sign.rawTransaction)
    console.log('sendTx---------receipt', receipt.transactionHash)
    console.log('==========================SendTx end==============================\n')
    return receipt
  } else {
    throw new Error('wallet is required')
  }
}
