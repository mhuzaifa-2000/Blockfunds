var MyContract = artifacts.require("Donors");

module.exports = function (deployer) {
    deployer.deploy(MyContract);
};