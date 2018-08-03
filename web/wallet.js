var provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/sF8QaFr5COSzwukN3V2Y")
var web3 = new Web3(provider)

var wallet = {
   account: null,
   balance: null,
   tokens: [],
   init: function (priv) {
      if (!priv) throw new Error('no priv key');
      this.account = web3.eth.accounts.wallet.add(priv)
      this.getBalance()
   },
   addToken: async function (tokenAddress) {
     if ( !tokenAddress ) throw new Error('no contract address')
     if ( !this.account ) throw new Error('no init wallet')

     let contract = new web3.eth.Contract(erc20interface, tokenAddress, {
       from: this.account.address,
       gas: 100000,
       gasPrice: '20000000000'
     })

     let token = { contract }
     let getBalance = () => token.contract.methods.balanceOf( this.account.address ).call()

     token.name = await token.contract.methods.name().call()

     token.getBalance = getBalance
     token.balance = await getBalance()

     token.send = (to, value) => token.contract.methods.transfer(to, value).send()

     this.tokens.push(token)

     return token
   },
   getBalance: function () {
      let req = web3.eth.getBalance(this.account.address)
      req.then( (balance) => this.balance = balance )
      return req
   },
   deposit: function () {
      alert(this.account.address)
   },
   withdraw: function (dest, value) {

      let transaction = web3.eth.sendTransaction({
         from: this.account.address,
         to: dest,
         value: value, //this.balance - 1e10,
         gas: 1e5
      })

      console.log( transaction )
      if ( transaction ) {
         this.balance -= value
         updateBalance( this.balance )
      }
   }
}
