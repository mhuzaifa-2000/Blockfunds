var MyContract = artifacts.require("Blockfunds");

module.exports = function (deployer) {
    deployer.deploy(MyContract);
};