pragma solidity ^0.8.0;

contract GameMarketplace {
    struct Game {
        uint id;
        string title;
        uint price;
        string description;
        string image; // Add image URL
        bool exists;  // To check if the game exists
        address developer; // Tracks the developer of the game
    }

    struct Transaction {
        uint gameId;
        address buyer;
        uint timestamp;
    }

    mapping(uint => Game) public games;
    mapping(address => Transaction[]) public userTransactions;
    uint public gameCount;

    event GameAdded(uint gameId, string title, address developer);
    event GamePurchased(uint gameId, address buyer, uint price);

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

    function purchaseGame(uint gameId) public payable {
        Game storage game = games[gameId];

        require(game.exists, "Game does not exist");
        require(msg.value == game.price, "Incorrect price sent");

        payable(game.developer).transfer(msg.value);

        userTransactions[msg.sender].push(
            Transaction(gameId, msg.sender, block.timestamp)
        );

        emit GamePurchased(gameId, msg.sender, msg.value);
    }

    // Fetch user transactions
    function getUserTransactions(address user)
        public
        view
        returns (Transaction[] memory)
    {
        return userTransactions[user];
    }

    // Fetch game by ID
    function getGameById(uint gameId)
        public
        view
        returns (Game memory)
    {
        require(games[gameId].exists, "Game does not exist");
        return games[gameId];
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
}