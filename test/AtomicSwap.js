const AtomicSwap = artifacts.require('AtomicSwap')

const sha256 = require('js-sha256')

const assertJump = require('./helpers/assertJump')
const assertRevert = require('./helpers/assertRevert')
const timetravel = require('./helpers/time-travel')

contract('AtomicSwap', async (accounts) => {

  const Owner = accounts[0]
  const alice = accounts[1]
  const bob = accounts[2]

  let swap

  before('setup contract', async () => {
    swap = await AtomicSwap.deployed()
  })

  // guy 1 locks ether
  // check swap is created and balance > 0
  // DONE

  // guy 2 withdraw2 ether
  // swap secret should be set now

  // guy 1 locks ether twice with different secrets
  // guy 2 withdraws both successfully
  describe('successful swaps', () => {
    it('Alice locks ether', async () => {
      const secret = 'aaa000aaa000'
      const swapAmount = 100000
      const hash = '0x' + sha256(secret)

      await swap.deposit(bob, hash, { from: alice, value: swapAmount /* wei */ })

      const _swap = await swap.swaps.call(alice, bob, hash)

      console.log(hash)
      console.log(_swap[1])

      const [_secret, _hash, created, balance] = _swap.valueOf()

      assert.notEqual(_secret, secret, 'should not be published')
      assert.equal(hash, _hash, 'should be the same hash')
      assert.equal(balance.toNumber(), swapAmount, 'should be funded')
    })

    it('Bob withdraw ether', async () => {
      const secret = 'aaa000aaa000'
      const swapAmount = 100000

      const balance_before = web3.eth.getBalance(bob).toNumber()
      console.log('Bobs balance before withdraw:', balance_before)

      await swap.withdraw(alice, secret, {from: bob})
      const _swap = await swap.swaps.call(alice, bob, hash)
      console.log('Swap', _swap)

      const [_secret, _hash, created, balance] = _swap.valueOf()
      console.log(_secret, _hash, created, balance)
      assert.equal(_secret, secret, 'should be published after withdraw')

      const balance_after = web3.eth.getBalance(bob).toNumber()
      console.log('Bobs balance after withdraw:', balance_after)
      assert.equal(balance_before + swapAmount, balance_after, 'bob received ether')
    })
  })

  // guy 1 does not lock ether
  // guy 2 tries to withdraw, failed

  // guy 1 lcks ether
  // guy 2 tries to guess secret but fails

  // guy 1 locks ether twice with the same secret

  // guy 1 locks ether
  // guy 1 withdraw after timeout / check time-travel.js

  describe('errorneus swaps', () => {

  })
  // contract call ???

})
