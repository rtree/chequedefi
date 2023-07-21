const ChequeDefi = artifacts.require("ChequeDefi");

module.exports = function(deployer) {
  deployer.deploy(ChequeDefi);
};
