var WorldToken = artifacts.require("./WorldToken.sol");

module.exports = function(deployer) {
  // deployment steps
  deployer.deploy(WorldToken);
};
