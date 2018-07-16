const assertJump = require('./helpers/assertJump')
const assertRevert = require('./helpers/assertRevert')

const WorldToken = artifacts.require('WorldToken')

contract('WorldToken', async (accounts) => {

  const Owner = accounts[0]
  const russiaBuyer = accounts[1]
  const chinaBuyer = accounts[2]

  let world

  let russiaID, chinaID

  before('setup contract', async () => {
    world = await WorldToken.deployed()
  })

  describe('initial state', () => {
    it('mints russia', async () => {
      await world.mintTo(Owner, '', 'Russia', { from: Owner })

      const _russiaIndex = await world.totalSupply.call()

      const russiaIndex = _russiaIndex.valueOf() - 1

      console.log('russiaIndex', russiaIndex)

      const _russiaID = await world.tokenByIndex.call(russiaIndex)

      russiaID = _russiaID.valueOf()

      console.log('russiaID', russiaID)

      assert.equal(russiaID != 0, true, 'russia doesnt exist')
    })

    it('mints china', async () => {
      await world.mintTo(Owner, '', 'China', { from: Owner })
      const _chinaIndex = await world.totalSupply.call()

      const chinaIndex = _chinaIndex.valueOf() - 1

      console.log('chinaIndex', chinaIndex)

      const _chinaID = await world.tokenByIndex.call(chinaIndex)

      chinaID = _chinaID.valueOf()

      console.log('chinaID', chinaID)

      assert(chinaID)
    })
  })

  describe('buy Russia', () => {
    it('successfully buys', async () => {
      // await world.buy(russiaID, { from: russiaBuyer}).value('1')
      await world.buy(russiaID, { from: russiaBuyer, value: '1' })

      assert.equal(true, true, 'cant buy Russia')

      const _lastPrice = await world.getCountryLastPrice.call(russiaID)
      const lastPrice = _lastPrice.valueOf()

      assert.equal(lastPrice, '1', 'last price not set')
    })

    it('has right name', async () => {
      const _russia = await world.getCountry.call(russiaID)

      const [ name, color, text ] = _russia.valueOf()

      console.log('name', name)
      console.log('color', color)

      assert.equal(name, 'Russia', 'wrong name')
      assert.equal(color, '0xffffff', 'wrong default color')
    })

    it('declines to buy if price is less', async () => {
      await world.buy(russiaID, { from: russiaBuyer, value: '2' })

      const _reply = world.buy(russiaID, { from: chinaBuyer, value: '1' })

      assertRevert(_reply);
    })

    it('buys if price is greater', () => {})

    it('has right owner', async () => {
      // let russiaID = await world.adopt(1, { from: russiaBuyer })
      // let chinaID = await world.adopt(2, { from: chinaBuyer })
      //
      // let owners = await world.getAdopters.call().valueOf()
      // let owner = owners[1]
      //
      // assert.equal(owner, russiaBuyer, 'wrong owner')
    })
  })


})
