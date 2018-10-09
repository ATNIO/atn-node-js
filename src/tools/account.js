
let web3 = require('web3')


/**
 * @func
 * @desc 判断当前账户是否锁定
 * @n
 * @param {string} account
 * @returns {boolean}
 */
function isAccountLocked(account) {
  try {
    web3.eth.sendTransaction({
      from: account,
      to: account,
      value: 0
    })
    return false
  } catch (err) {
    return (err.message == 'authentication needed: password or unlock')
  }
}

/**
 * @func
 * @desc 多个账户解锁
 *
 * @param {object[]} accounts - 钱包下所有账户地址
 * @param {string[]} passwords - 账户所对应的密码
 * @param {number} [unlock_duration_sec] - 时间戳(解锁时间)
 */
function unlockAccountsIfNeeded(accounts, passwords, unlock_duration_sec) {
  if (typeof(unlock_duration_sec) === 'undefined') unlock_duration_sec = 3600

  for (let i = 0; i < accounts.length; i++) {
    if (isAccountLocked(accounts[i])) {
      console.log('Account ' + accounts[i] + ' is locked. Unlocking')
      web3.personal.unlockAccount(accounts[i], passwords[i], unlock_duration_sec)
    }
  }
}

/**
 * @func
 * @desc 多个账户解锁
 *
 * @param {object} account - 账户地址
 * @param {string} password - 账户密钥
 * @param {number} [unlock_duration_sec] - 解锁时间长短
 */
function unlockSingleAccountIfNeeded(account,password,unlock_duration_sec) {
  if (typeof(unlock_duration_sec) === 'undefined') unlock_duration_sec = 3600
  web3.personal.unlockAccount(account,password,unlock_duration_sec)
}


module.exports = {
  isAccountLocked,
  unlockAccountsIfNeeded,
  unlockSingleAccountIfNeeded
}

