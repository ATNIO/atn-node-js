const gasConfig = require('./config/config')


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
