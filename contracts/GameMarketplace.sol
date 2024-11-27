// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameMarketplace {
    struct Game {
        uint id;
        string title;
        uint price;
        string description; // Add description
        string image;       // Add image URL
        bool exists;        // To check if the game exists
        address owner;      // Tracks the current owner of the game
    }

    mapping(uint => Game) public games;
    uint public gameCount;

    event GameAdded(uint gameId, string title, address developer);
    event GamePurchased(uint gameId, address buyer);

    // Add a new game to the marketplace
    function addGame(
        string memory title,
        uint price,
        string memory description,
        string memory image
    ) public {
        gameCount++;
        games[gameCount] = Game(gameCount, title, price, description, image, true, msg.sender);

        emit GameAdded(gameCount, title, msg.sender);
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

        // Update game ownership to the buyer
        game.owner = msg.sender;

        // Emit the event to notify the purchase
        emit GamePurchased(gameId, msg.sender);
    }

    // Get the details of a specific game by its ID
    function getGame(uint gameId)
        public
        view
        returns (
            string memory title,
            uint price,
            string memory description,
            string memory image,
            address owner
        )
    {
        Game memory game = games[gameId];

        // Ensure the game exists
        require(game.exists, "Game does not exist");

        return (game.title, game.price, game.description, game.image, game.owner);
    }

    // Get all games in the marketplace
    function getAllGames()
        public
        view
        returns (Game[] memory)
    {
        Game[] memory allGames = new Game[](gameCount);
        for (uint i = 1; i <= gameCount; i++) {
            allGames[i - 1] = games[i];
        }
        return allGames;
    }

    // Function to get the contract owner's address
    function contractOwner() public pure returns (address) {
        return address(0x3BdEF492279A93496bc8D27EF9C49C2bE56ca2b0); // Replace with actual address
    }
}

