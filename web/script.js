const ETHERSCANBASE="https://rinkeby.etherscan.io/address/"

const CONFIG = {
  PRIV: "",
  CONTRACT: "0x60c205722c6c797c725a996cf9cCA11291F90749",
}

function updateBalance( newBalance ) {
  $('.balance').innerText = "" + (newBalance / 1e18) + " ETH     /      " + newBalance + " wei"
}

function deposit() {
  alert("Address copied: \n" + wallet.account.address)
}

function withdraw(dest, value) {
  dest = dest || window.prompt("Send to:")
  value = value || 1e18

  return wallet.withdraw(dest, value)
}

async function setup() {
  new ClipboardJS('.cb-element');

  const account = wallet.init(CONFIG.PRIV)

  const world = new World(account)

  $ = (selector) => document.querySelector(selector)

  $('.address').innerText = wallet.account.address
//  $('.address').onclick = () => wallet.deposit()
  $('.link-address').href = ETHERSCANBASE + wallet.account.address

  balance = await wallet.getBalance()
  updateBalance( balance )

  $('.link-deposit').onclick = () => deposit()
  $('.link-withdraw').onclick = () => withdraw()

  const country_template = $('.country')
  const list = $('.token-list')

  data = world.getCountries()

  const [ countries, prices, owners ] = await data

  countries.forEach( ({ name, color, text }, index) => {
    console.log(name, color, text, prices[index], owners[index])

    const price = parseInt(prices[index])
    const elem = country_template.cloneNode(true)

    elem.style.background = color.replace('0x', '#')
    elem.querySelector('.country-id').innerText = index
    elem.querySelector('.country-name').innerText = name
    elem.querySelector('.country-text').innerText = text
    elem.querySelector('.country-price').innerText = web3.utils.fromWei('' + price)
    elem.querySelector('.buy-country').innerText = 'Buy!'
    elem.querySelector('.buy-country').onclick = () => world.buyCountry(index, price + 1e17)

    list.appendChild(elem)
  })

}

window.onload = setup;
