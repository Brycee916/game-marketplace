const GameMarketplace = artifacts.require("GameMarketplace");

module.exports = function (deployer) {
    deployer.deploy(GameMarketplace);
};
