const SellLandContract = artifacts.require("SellLand");

contract('SellLand', async (accounts) => {

  const Owner = accounts[0]
  const russiaBuyer = accounts[1]
  const chinaBuyer = accounts[2]

  let SellLand

  before('setup contract', async () => {
    SellLand = await SellLandContract.deployed()
  })

  describe('initial state', () => {
    it('has no owners', async () => {
      let owners = await SellLand.getAdopters.call()

      owners = owners.filter(o => o.slice(-1) != '0')

      assert.equal(owners.length, 0, 'owners array length zero')
    })
  })

  describe('buy Russia', () => {
    it('successfully buys', async () => {
      let russiaID = await SellLand.adopt(1, { from: russiaBuyer })
      russiaID = await SellLand.adopt.call(1, { from: russiaBuyer })

      assert.equal(russiaID, 1, 'cant buy Russia')
    })

    it('has right owner', async () => {
      let russiaID = await SellLand.adopt(1, { from: russiaBuyer })
      let chinaID = await SellLand.adopt(2, { from: chinaBuyer })

      let owners = await SellLand.getAdopters.call().valueOf()
      let owner = owners[1]
      
      assert.equal(owner, russiaBuyer, 'wrong owner')
    })
  })


})
