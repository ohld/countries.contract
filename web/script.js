const ETHERSCANBASE="https://rinkeby.etherscan.io/address/"
const CONFIG = {
  PRIV: "0xd63264601ef2d420fe05decf1e3f7756b2826d69c33d16b7dd1fb5b0d79fe91d",
  CONTRACT: "0x60c205722c6c797c725a996cf9cCA11291F90749",
}

function updateBalance( newBalance ) {
  $('.balance').innerText = "" + (newBalance / 1e18) + " ETH     /      " + newBalance + " wei"
}

function updateTokenBalance( tokenIndex, newBalance ) {
  $('.token .token-balance').innerText = newBalance
}

function updateTokenName( tokenIndex, name ) {
  $('.token .token-name').innerText = name
}

function deposit() {
  alert("Address copied: \n" + wallet.account.address)
}

function withdraw(dest, value) {
  dest = dest || window.prompt("Send to:")
  value = value || 1e18

  return wallet.withdraw(dest, value)
}

function withdrawToken(token, dest, value) {
  token = token || wallet.tokens[0]
  dest = dest || window.prompt("Send to:")
  value = value || window.prompt("Amount of tokens (current balance " + token.balance + " " + token.name + "): ")

  value = parseInt(value) || 0

  let transaction = token.send(dest, value)

  console.log( transaction )
  return transaction
}

async function setup() {
  new ClipboardJS('.cb-element');

  wallet.init(CONFIG.PRIV)

  $ = (selector) => document.querySelector(selector)

  $('.address').innerText = wallet.account.address
//  $('.address').onclick = () => wallet.deposit()
  $('.link-address').href = ETHERSCANBASE + wallet.account.address

  balance = await wallet.getBalance()
  updateBalance( balance )

  $('.link-deposit').onclick = () => deposit()
  $('.link-withdraw').onclick = () => withdraw()

  let token = await wallet.addToken(CONFIG.CONTRACT)
  let tokenBalance = await token.getBalance()
  updateTokenBalance( 0, tokenBalance )
  updateTokenName( 0, token.name )

  $('.send-token').onclick = () => withdrawToken()
}

window.onload = setup;
