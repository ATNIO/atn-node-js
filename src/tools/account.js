import * as web3 from 'web3'


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

function unlockAccountsIfNeeded(accounts, passwords, unlock_duration_sec) {
  if (typeof(unlock_duration_sec) === 'undefined') unlock_duration_sec = 300

  for (let i = 0; i < accounts.length; i++) {
    if (isAccountLocked(accounts[i])) {
      console.log('Account ' + accounts[i] + ' is locked. Unlocking')
      web3.personal.unlockAccount(accounts[i], passwords[i], unlock_duration_sec)
    }
  }
}

export { isAccountLocked, unlockAccountsIfNeeded }
