var WorldToken = artifacts.require("./WorldToken.sol");
var AtomicSwap = artifacts.require("./AtomicSwap.sol");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(WorldToken);
  deployer.deploy(AtomicSwap);
};
