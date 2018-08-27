const gasConfig = require('./config/config')
//
// var getWallet = function(from, accounts) {
//   var wallet = null
//   if (_.isNumber(from)) {
//     wallet = accounts.wallet[from]
//   } else if (_.isObject(from) && from.address && from.privateKey) {
//     wallet = from
//   } else {
//     wallet = accounts.wallet[from]
//   }
//   return wallet
// }
//
//
// module.exports = async (web3, contract, method, params, value) => {
//   let wallet = getWallet(web3.eth.defaultAccount, web3.eth.accounts)
//   console.log('==========================SendTx start==============================\n')
//   if (wallet && wallet.privateKey) {
//     console.log('sendTx---------accounts', web3.eth.defaultAccount)
//     console.log('sendTx---------method', method)
//     console.log('sendTx---------params', params)
//     const callData = contract.methods[method](...params).encodeABI()
//     const rawTx = {
//       value: value,
//       gasPrice: gasConfig.gasPrice,
//       gasLimit: gasConfig.gasLimit,
//       to: contract.options.address,
//       data: callData
//     }
//     console.log('wallet.privateKey :', wallet.privateKey)
//     let sign = await web3.eth.accounts.signTransaction(rawTx, wallet.privateKey)
//     const receipt = await web3.eth.sendSignedTransaction(sign.rawTransaction)
//     console.log('sendTx---------receipt', receipt.transactionHash)
//     console.log('==========================SendTx end==============================\n')
//     return receipt
//   } else {
//     throw new Error('wallet is required')
//   }
// }

module.exports = async (web3, account, contract, method, params, value=0) => {
  let gasPrice = await web3.eth.getGasPrice()
  let gasLimit = await contract.methods[method](...params).estimateGas({
    from: account.address,
    value: value,
    gas: 5000000
  })
  let txData = contract.methods[method](...params).encodeABI()
  let rawTx = {
    to: contract.options.address,
    value: value,
    gasPrice: gasPrice,
    gas: gasLimit,
    data: txData
  }
  let signTx = await web3.eth.accounts.signTransaction(rawTx, account.privateKey)
  return web3.eth.sendSignedTransaction(signTx.rawTransaction)
}
