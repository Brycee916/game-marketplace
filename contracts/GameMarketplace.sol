// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameMarketplace {
    struct Game {
        uint id;
        string title;
        uint price;
        bool exists; // To check if the game exists
    }

    mapping(uint => Game) public games;
    uint public gameCount;

    event GamePurchased(uint gameId, address buyer);

    // Add a new game to the marketplace
    function addGame(string memory title, uint price) public {
        gameCount++;
        games[gameCount] = Game(gameCount, title, price, true);
    }

    // Purchase a game from the marketplace
    function purchaseGame(uint gameId) public payable {
        Game storage game = games[gameId];

        // Check if the game exists
        require(game.exists, "Game does not exist");
        
        // Check if the correct amount of Ether is sent
        require(msg.value == game.price, "Incorrect price sent");

        // Transfer the Ether to the contract's owner (or another address)
        payable(owner()).transfer(msg.value);  // Ensure you have an owner() function or replace with a specific address

        // Emit the event to notify the purchase
        emit GamePurchased(gameId, msg.sender);
    }

    // Get the details of a specific game by its ID
    function getGame(uint gameId) public view returns (string memory, uint) {
        Game memory game = games[gameId];
        
        // Ensure the game exists
        require(game.exists, "Game does not exist");
        
        return (game.title, game.price);
    }

    // This could be the deployer's address or any specific address that you want to receive the funds
    address private _owner = 0x8488Fc4d4f8bB35605ce1Ee0f5A1A6172F9106c0; // Replace with actual address
    function owner() public view returns (address) {
        return _owner;
    }
}
