const AtomicSwap = artifacts.require('AtomicSwap')

const sha256 = require('js-sha256')

const assertJump = require('./helpers/assertJump')
const assertRevert = require('./helpers/assertRevert')
const timetravel = require('./helpers/time-travel')

const crypto = require('crypto')
const genSecret = () => crypto.randomBytes(32)

contract('AtomicSwap', async (accounts) => {

  const Owner = accounts[0]
  const alice = accounts[1]
  const bob = accounts[2]

  let swap

  before('setup contract', async () => {
    swap = await AtomicSwap.deployed()
  })

  describe('sha256', () => {
    it('the same in js', async () => {
      const __secret = genSecret()
      const secret = '0x' + __secret.toString('hex')
      const hash = '0x' + sha256(__secret)

      const _sig = await swap.checkSig.call(secret)
      console.log('sig', _sig)

      assert.equal(_sig.valueOf(), hash, 'hashes should match')
    })
  })

  // guy 1 locks ether
  // check swap is created and balance > 0
  // DONE

  // guy 2 withdraw2 ether
  // swap secret should be set now

  // guy 1 locks ether twice with different secrets
  // guy 2 withdraws both successfully
  describe('successful swaps', () => {
    const swapAmount = 1 * 1e18
    const __secret = genSecret()
    const secret = '0x' + __secret.toString('hex')
    const hash = '0x' + sha256(__secret)

    const __secret2 = genSecret()
    const secret2 = '0x' + __secret2.toString('hex')
    const hash2 = '0x' + sha256(__secret2)

    const __secret3 = genSecret()
    const secret3 = '0x' + __secret3.toString('hex')
    const hash3 = '0x' + sha256(__secret3)

    it('Alice locks ether', async () => {
      await swap.deposit(bob, hash, { from: alice, value: swapAmount /* wei */ })

      const _swap = await swap.swaps.call(alice, bob, hash)

      console.log(hash)
      console.log(_swap[1])

      const [_secret, _hash, created, balance] = _swap.valueOf()

      assert.notEqual(secret, _secret, 'should not be published')
      assert.equal(hash, _hash, 'should be the same hash')
      assert.equal(balance.toNumber(), swapAmount, 'should be funded')
    })

    it('Bob withdraw ether', async () => {
      const balance_before = web3.eth.getBalance(bob).toNumber()

      await swap.withdraw(alice, secret, {from: bob})

      const _swap = await swap.swaps.call(alice, bob, hash)
      console.log('Swap', _swap)

      const [_secret, _hash, created, balance] = _swap.valueOf()

      assert.equal(balance.toNumber(), swapAmount, 'balance should be the same as funded')
      assert.equal(_secret, secret, 'should be published after withdraw')

      const balance_after = web3.eth.getBalance(bob).toNumber()

      assert(balance_before < balance_after, 'bob received ether')
    })

    it('Locks twice with the same secret', async () => {
      await swap.deposit(alice, hash2, { from: bob, value: swapAmount /* wei */ })
      const _swap1 = await swap.swaps.call(bob, alice, hash2)
      const [_secret1, _hash1, created1, balance1] = _swap1.valueOf()

      await swap.deposit(alice, hash2, { from: bob, value: swapAmount /* wei */ })
      const _swap2 = await swap.swaps.call(bob, alice, hash2)
      const [_secret2, _hash2, created2, balance2] = _swap2.valueOf()

      assert.notEqual(_secret1, _secret2, 'same secret')
      assert.equal(_hash1, _hash2, 'same hash')
      assert.equal(created1, created2, 'same created')
      assert.equal(balance1, balance2, 'same balance')
    })

    it('Withdraw two times in a row', async () => {
      assert(await swap.withdraw(alice, secret2, {from: bob}), 'valid first withdrawal')
      assertRevert(await swap.withdraw(alice, secret2, {from: bob}), 'invalid second withdrawal')
    })

    it('Locks and random secret does not fit', async () => {
      const wrongSecret = '0x' + 'YOURMOM'
      await swap.deposit(bob, hash3, { from: alice, value: swapAmount /* wei */ })
      const balance_before = web3.eth.getBalance(bob).toNumber()

      const _reply = await swap.withdraw(alice, wrongSecret, {from: bob})
      assertRevert(_reply)

      const balance_after = web3.eth.getBalance(bob).toNumber()
      asser.equal(balance_before, balance_after, 'bob did not guess the secret')
    })
  })

  // guy 1 does not lock ether
  // guy 2 tries to withdraw, failed

  // guy 1 lcks ether  DONE
  // guy 2 tries to guess secret but fails  DONE

  // guy 1 locks ether twice with the same secret

  // guy 1 locks money
  // guy 2 tries to withdraw two times a row

  // guy 1 locks ether
  // guy 1 withdraw after timeout / check time-travel.js

  describe('errorneus swaps', () => {

  })
  // contract call ???

})
