// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameMarketplace {
    struct Game {
        uint id;
        string title;
        uint price;
        bool exists; // To check if the game exists
        address owner; // Tracks the current owner of the game
    }

    mapping(uint => Game) public games;
    uint public gameCount;
    mapping(address => uint) public userGameCount; // Tracks the number of games owned by each user

    event GamePurchased(uint gameId, address buyer, uint price, uint timestamp);
    event GameTransferred(uint gameId, address from, address to);

    // Add a new game to the marketplace
    function addGame(string memory title, uint price) public {
        gameCount++;
        games[gameCount] = Game(gameCount, title, price, true, msg.sender);
        userGameCount[msg.sender]++; // Increment the creator's game count
    }

    // Purchase a game from the marketplace
    function purchaseGame(uint gameId) public payable {
        Game storage game = games[gameId];

        // Check if the game exists
        require(game.exists, "Game does not exist");

        // Check if the correct amount of Ether is sent
        require(msg.value == game.price, "Incorrect price sent");

        // Transfer the Ether to the game's owner
        payable(game.owner).transfer(msg.value);

        // Adjust game ownership counts
        userGameCount[game.owner]--; // Decrease previous owner's count
        userGameCount[msg.sender]++; // Increase buyer's count

        // Transfer ownership to the buyer
        address previousOwner = game.owner;
        game.owner = msg.sender;

        // Emit the events to notify the purchase and ownership change
        emit GamePurchased(gameId, msg.sender, game.price, block.timestamp);
        emit GameTransferred(gameId, previousOwner, msg.sender);
    }

    // Refund a purchased game
    function refundGame(uint gameId) public {
    Game storage game = games[gameId];

    // Ensure the game exists
    require(game.exists, "Game does not exist");

    // Ensure the caller owns the game
    require(game.owner == msg.sender, "You are not the owner of this game");

    // Ensure the game is not owned by the original creator (cannot refund free games)
    address originalOwner = owner(); // The contract owner is assumed to be the original seller
    require(game.owner != originalOwner, "Refund not applicable for this game");

    // Emit debug information
    emit DebugInfo(gameId, msg.sender, game.owner, originalOwner);

    // Transfer the Ether back to the user
    uint refundAmount = game.price;
    payable(msg.sender).transfer(refundAmount);

    // Reset the game's ownership to the original seller
    game.owner = originalOwner;

    // Update user game count
    userGameCount[msg.sender]--;
    userGameCount[originalOwner]++;

    // Emit an event for the refund
    emit GameTransferred(gameId, msg.sender, originalOwner);
}

// Debugging event
event DebugInfo(uint gameId, address caller, address currentOwner, address originalOwner);


    // Transfer ownership of a game
    function transferGame(uint gameId, address newOwner) public {
        Game storage game = games[gameId];

        // Ensure the game exists
        require(game.exists, "Game does not exist");

        // Check that the caller is the current owner
        require(game.owner == msg.sender, "You are not the owner of this game");

        // Adjust game ownership counts
        userGameCount[msg.sender]--; // Decrease sender's count
        userGameCount[newOwner]++;   // Increase recipient's count

        // Update the game's owner
        address previousOwner = game.owner;
        game.owner = newOwner;

        // Emit an event for the transfer
        emit GameTransferred(gameId, previousOwner, newOwner);
    }

    // Get the details of a specific game by its ID
    function getGame(uint gameId) public view returns (string memory, uint, address) {
        Game memory game = games[gameId];

        // Ensure the game exists
        require(game.exists, "Game does not exist");

        return (game.title, game.price, game.owner);
    }

    // List all game titles in a user's library
    function getUserLibrary(address user) public view returns (string[] memory) {
        uint userGameCounter = 0;

        // Count how many games the user owns
        for (uint i = 1; i <= gameCount; i++) {
            if (games[i].owner == user) {
                userGameCounter++;
            }
        }

        // Create an array to hold the titles of the user's games
        string[] memory userGameTitles = new string[](userGameCounter);
        uint index = 0;

        // Populate the array with the user's game titles
        for (uint i = 1; i <= gameCount; i++) {
            if (games[i].owner == user) {
                userGameTitles[index] = games[i].title;
                index++;
            }
        }

        return userGameTitles;
    }

    // This could be the deployer's address or any specific address that you want to receive the funds
    address private _owner = 0x8488Fc4d4f8bB35605ce1Ee0f5A1A6172F9106c0; // Replace with actual address
    function owner() public view returns (address) {
        return _owner;
    }
}
