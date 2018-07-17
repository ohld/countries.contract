# WorldToken

# Install

```bash
# npm modules
npm i

# run tests
truffle test --network=rinkeby

# to test locally:
# 1. Run Ganache or Geth or whatever configured
# 2. Run truffle test suite:
truffle test --network=local
# or
truffle test --network=development

# deploy
truffle migrate --network=rinkeby

# clean build artifacts if cache gets in the way
truffle migrate --network=local --reset
# or
truffle migrate --network=development --reset
```
