const WORLD = {
  address: '0x97b4e248a81f17af5ece8b7baf5f3f2cec8c139c',
  abi: WORLD_TOKEN_ABI,
}

class World {
  constructor (account, config = WORLD) {
    if (!account) throw new Error(`Init account using wallet.init()`)

    this.account = account

    this.params = {
      from: account.address,
      gas: 1e6,
      gasPrice: 2e10
    }

    this.token = new web3.eth.Contract(config.abi, config.address, this.params)

  }

  async fetchCountry(_countryId) {
    console.log('id', _countryId)
    return this.token.methods.getCountry(_countryId).call()
  }

  async getCountries(_address) {
    const address = _address || this.account.address
    console.log('address', address)
    const _length = await this.token.methods.totalSupply().call()

    const length = parseInt(_length)

    const _ids = Array(length).fill(null).map( (e, index) =>
      this.token.methods.tokenByIndex(index).call())

    const ids = await Promise.all(_ids)

    console.log('ids', ids)

    const _countries = ids.map( id =>
      this.token.methods.getCountry(id).call() )

    const _prices = ids.map( id =>
      this.token.methods.getCountryLastPrice(id).call() )

    const _owners = ids.map( id =>
      this.token.methods.ownerOf(id).call() )

    return Promise.all([
      Promise.all(_ids),
      Promise.all(_countries),
      Promise.all(_prices),
      Promise.all(_owners)
    ])
  }

  async listAll() {
    return this.token.methods.allTokensIndex.call()
  }

  async buyCountry(id, price) {
    if (!id && id !== 0) throw new Error(`No id`)

    const lastPrice = await this.token.methods.getCountryLastPrice(id).call()

    if (price < lastPrice) throw new Error(`Price is less: ${price} < ${lastPrice}`)

    const value = (price)

    const receipt = this.token.methods.buy(id).send({ value, ...this.params })

    receipt.on('transactionHash', (hash) => console.log('buy', hash))

    return receipt
  }

  async customize(id, { color, text }) {
    if (!id && id !== 0) throw new Error(`No id`)

    const _country = await this.token.methods.getCountry(id).call()
    const _color = _country.color
    const _text = _country.text

    const receipt = this.token.methods.customize(id, color || _color, text || _text).send(this.params)

    receipt.on('transactionHash', (hash) => console.log('color', hash))

    receipt.catch(error => console.error(error))

    return receipt
  }

}
