// GameMarketplace.test.js
const GameMarketplace = artifacts.require("GameMarketplace");

contract("GameMarketplace", (accounts) => {
    let marketplace;

    beforeEach(async () => {
        marketplace = await GameMarketplace.new();
    });

    it("should deploy the contract", async () => {
        assert.ok(marketplace.address, "Contract should be deployed");
    });

    it("should add a game and fetch it", async () => {
        await marketplace.addGame("Super Mario", web3.utils.toWei("0.1", "ether"), { from: accounts[0] });
        const game = await marketplace.getGame(1);
        assert.equal(game[0], "Super Mario", "Game title is incorrect");
        assert.equal(game[1], web3.utils.toWei("0.1", "ether"), "Game price is incorrect");
    });

    it("should allow a user to purchase a game", async () => {
        await marketplace.addGame("Super Mario", web3.utils.toWei("0.1", "ether"), { from: accounts[0] });
        
        const tx = await marketplace.purchaseGame(1, { from: accounts[1], value: web3.utils.toWei("0.1", "ether") });
        
        // Check if the event was emitted
        const event = tx.logs[0];
        assert.equal(event.event, "GamePurchased", "Event was not emitted correctly");
        assert.equal(event.args.gameId.toString(), "1", "Game ID in event does not match");
        assert.equal(event.args.buyer, accounts[1], "Buyer address in event does not match");

        // Check if the game was purchased correctly
        const game = await marketplace.getGame(1);
        assert.equal(game[0], "Super Mario", "Game title after purchase is incorrect");
        assert.equal(game[1], web3.utils.toWei("0.1", "ether"), "Game price after purchase is incorrect");
    });
});
