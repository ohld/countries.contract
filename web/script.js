const ETHERSCANBASE="https://rinkeby.etherscan.io/address/"

const $ = (selector) => document.querySelector(selector)

const toHex = (byteArray) => byteArray.reduce((output, elem) =>
  (output + ('0' + elem.toString(16)).slice(-2)), '')

const isBright = (color) => {
  const hex = color.replace('0x', '')
  const r = parseInt(hex.slice(0, 2), 16)
  const g = parseInt(hex.slice(2, 4), 16)
  const b = parseInt(hex.slice(4, 6), 16)

  return (r * 0.299 + g * 0.587 + b * 0.114) > 186
}

const drawCountry = (data, template) => {
  const { id, name, color, text, price } = data
  console.log(data, template)
  console.log(id, name, color, text, price)
  const elem = template.cloneNode(true)

  elem.style.background = color.replace('0x', '#')
  elem.style.color = isBright(color) ? 'black' : 'white'
  elem.querySelector('.country-id').innerText = id
  elem.querySelector('.country-name').innerText = unescape(name)
  elem.querySelector('.country-text').innerText = unescape(text)
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

    const [ ids, _countries, prices, owners ] = await data

    const countries = _countries.map( (country, index) =>
      ({
        id: ids[index],
        price: parseInt(prices[index]),
        owner: owners[index],
        ...country
      }))

    countries
    .sort( (c1, c2) => {
        return c2.price - c1.price
    })
    .forEach( (country) => {

        const { id, price, owner } = country

        const redraw = (country) =>
          drawCountry(country, country_template)

        const elem = redraw(country)

        list.appendChild(elem)

        elem.querySelector('.buy-country').onclick = (ev) => {
          world.buyCountry(id, price + 1e17)
          .finally( () => ev.target.innerText = 'Buy!' )
          .finally( () => reload(world) )

          elem.querySelector('.buy-country').innerText = 'Loading...'
        }

        if (owner !== wallet.account.address) {
          elem.querySelectorAll('.change').forEach(
            div => div.style.display = 'none' )
          return
        }

        elem.querySelector('.change.color').onclick = (ev) => {
          const color = window.prompt('Input new color')
          if (!color) return
          world.customize(id, { color })
            .finally( () => ev.target.innerText = 'PUT COLOR' )
            .finally( () => reload(world) )

          ev.target.innerText = 'Loading...'
        }

        elem.querySelector('.change.text').onclick = (ev) => {
          const text = window.prompt('Input new text')
          if (!text) return
          world.customize(id, { text })
            .finally( () => ev.target.innerText = 'PUT TEXT' )
            .finally( () => reload(world) )

          ev.target.innerText = 'Loading...'
        }

        let arr = new Uint8Array([255,255,255])

        elem.querySelector('.change.random.color').onclick = (ev) => {
          const randomColor = window.crypto.getRandomValues(arr)

          const bytes = toHex(randomColor)

          world.customize(id, { color: `0x${bytes}` })
            .finally( () => ev.target.innerText = 'MIX COLOR' )
            .finally( () => reload(world) )

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
