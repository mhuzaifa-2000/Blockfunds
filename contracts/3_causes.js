var MyContract = artifacts.require("Causes");

module.exports = function (deployer) {
    deployer.deploy(MyContract);
};