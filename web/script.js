const ETHERSCANBASE="https://rinkeby.etherscan.io/address/"

const $ = (selector) => document.querySelector(selector)

const toHex = (byteArray) => byteArray.reduce((output, elem) =>
  (output + ('0' + elem.toString(16)).slice(-2)), '')

const drawCountry = (data, template) => {
  const { id, name, color, text, price } = data
  console.log(data, template)
  console.log(id, name, color, text, price)
  const elem = template.cloneNode(true)

  elem.style.background = color.replace('0x', '#')
  elem.querySelector('.country-id').innerText = id
  elem.querySelector('.country-name').innerText = name
  elem.querySelector('.country-text').innerText = text
  elem.querySelector('.country-price').innerText = web3.utils.fromWei('' + price)
  elem.querySelector('.buy-country').innerText = 'Buy!'

  return elem
}

const CONFIG = {
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


const reload = async (world) => {

    const data = world.getCountries()

    const list = $('.token-list')
    const country_template = $('.country')
    list.innerHTML = country_template.outerHTML

    const [ ids, countries, prices, owners ] = await data

    countries.forEach( (country, index) => {

        const price = parseInt(prices[index])

        const redraw = (country, index) =>
        drawCountry(
          { id: ids[index], price, ...country }, country_template)

        const elem = redraw(country, index)
        const id = ids[index]

        list.appendChild(elem)

        elem.querySelector('.buy-country').onclick = (ev) => {
          world.buyCountry(ids[index], price + 1e17)
          .finally( () => ev.target.innerText = 'Buy!' )

          elem.querySelector('.buy-country').innerText = 'Loading...'
        }

        if (owners[index] !== wallet.account.address) {
          elem.querySelector('.actions').style.display = 'none'
          return
        }

        elem.querySelector('.change.color').onclick = (ev) => {
          const color = window.prompt('Input new color')
          world.customize(ids[index], { color })
            .finally( () => ev.target.innerText = 'PUT COLOR' )

          ev.target.innerText = 'Loading...'
        }

        elem.querySelector('.change.text').onclick = (ev) => {
          const text = window.prompt('Input new text')
          world.customize(ids[index], { text })
            .finally( () => ev.target.innerText = 'PUT TEXT' )

          ev.target.innerText = 'Loading...'
        }

        let arr = new Uint8Array([255,255,255])

        elem.querySelector('.change.random.color').onclick = (ev) => {
          const randomColor = window.crypto.getRandomValues(arr)

          const bytes = toHex(randomColor)

          world.customize(ids[index], { color: `0x${bytes}` })
            .finally( () => ev.target.innerText = 'MIX COLOR' )

          ev.target.innerText = 'Loading...'
        }

    })
}

async function setup() {
  new ClipboardJS('.cb-element');

  const account = wallet.init()

  const world = new World(account)

  $('.address').innerText = wallet.account.address
  $('.link-address').href = ETHERSCANBASE + wallet.account.address

  balance = await wallet.getBalance()
  updateBalance( balance )

  $('.link-deposit').onclick = () => deposit()
  $('.link-withdraw').onclick = () => withdraw()

  $('.link-refresh').onclick = () => reload(world)
  reload(world)

}

window.onload = setup;
