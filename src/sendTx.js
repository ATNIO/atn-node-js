const gasConfig = require('./config/config')
/**
 * SendTx
 * @module src/sendTx
 *
 * @param {object} web3 - 声明的节点的Web3对象
 * @param {object} account - 节点的账户对象
 * @param {object} contract - 要使用节点合约ABI对象
 * @param {string} method - 要使用的合约的具体方法和入参类型 eg. mymethod(address,uint32...)
 * @param {object[]} params - 合约方法入参 eg.[param1,param2...]
 * @param {number} value - 存入交易
 * @returns {Promise<PromiEvent<TransactionReceipt>>}
 */
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
