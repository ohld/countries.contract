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
    it('mints countries', async () => {
      await world.mintTo(Owner, '', 'Russia', { from: Owner })
      const russiaIndex = await world.allTokens.length.call()

      await world.mintTo(Owner, '', 'China', { from: Owner })
      const chinaIndex = await world.allTokens.length.call()

      russiaIndex = russiaIndex.valueOf()
      chinaIndex = chinaIndex.valueOf()

      russiaID = await world.tokenByIndex.call(russiaIndex)
      console.log('russiaID', russiaID)
      console.log('chinaID', chinaID)

      assert.equal(russiaID != 0, true, 'russia doesnt exist')
    })
  })

  describe('buy Russia', () => {
    // it('successfully buys', async () => {
    //   const id = await world.buy(russiaID) //{ from: russiaBuyer, value: '1' })
    //
    //   assert.equal(id.valueOf(), 1, 'cant buy Russia')
    // })

    it('has right name', async () => {
      const russia = await world.getCountry.call(russiaID)

      console.log(russia.valueOf())

      assert.equal(russia.valueOf().name, 'Russia', 'wrong name')
    })

    it('declines to buy if price is less', () => {})
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
