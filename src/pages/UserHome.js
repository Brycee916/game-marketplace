import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import contractABI from "../contracts/GameMarketplace.json";
import { ethers } from "ethers";

const contractAddress = "0x6DBa90e8166fbA73ac66CCe38F814cf6E5350B44";

const UserHome = () => {
  const [games, setGames] = useState([]);
  const [purchasedGames, setPurchasedGames] = useState([]);
  const [search, setSearch] = useState("");
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [marketplaceContract, setMarketplaceContract] = useState(null);

  useEffect(() => {
    const setupProviderAndContract = async () => {
      if (window.ethereum) {
        const newProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(newProvider);

        await window.ethereum.request({ method: "eth_requestAccounts" });

        const newSigner = newProvider.getSigner();
        setSigner(newSigner);

        const contract = new ethers.Contract(contractAddress, contractABI.abi, newSigner);
        setMarketplaceContract(contract);
      }
    };

    setupProviderAndContract();
  }, []);

  useEffect(() => {
    if (marketplaceContract && signer) {
      fetchGames();
      fetchPurchasedGames();
    }
  }, [marketplaceContract, signer]);

  const fetchGames = async () => {
    if (!marketplaceContract) return;

    try {
      const gameList = await marketplaceContract.getAllGames();
      const formattedGames = gameList.map((game) => ({
        id: game.id.toNumber(),
        title: game.title,
        price: ethers.utils.formatEther(game.price),
        description: game.description,
        image: game.image,
      }));
      setGames(formattedGames);
    } catch (error) {
      console.error("Error fetching games:", error);
    }
  };

  const fetchPurchasedGames = async () => {
    try {
      const userAddress = await signer.getAddress();
      const userTransactions = await marketplaceContract.getUserTransactions(userAddress);
      
      const purchasedGameIds = userTransactions.map((transaction) => transaction.gameId.toNumber());
      setPurchasedGames(purchasedGameIds);
    } catch (error) {
      console.error("Error fetching purchased games:", error);
    }
  };

  const handlePurchase = async (game) => {
    if (!marketplaceContract || !signer) {
      alert("Contract not initialized or need to connect wallet");
      return;
    }

    try {
      const price = ethers.utils.parseEther(game.price);

      const tx = await marketplaceContract.purchaseGame(game.id, { value: price });
      await tx.wait();
      alert(`Successfully purchased ${game.title}!`);
      fetchPurchasedGames(); // Refresh purchased games after successful purchase
    } catch (error) {
      console.error("Error purchasing game:", error);
      alert("Transaction failed. Please try again.");
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "#f4f4f9",
      minHeight: "100vh",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    searchBar: {
      width: "60%",
      padding: "10px",
      margin: "80px 0 20px 0",
      borderRadius: "5px",
      border: "1px solid #ddd",
      fontSize: "16px",
    },
    gameList: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "15px",
      justifyContent: "center",
      width: "100%",
      maxWidth: "1000px",
    },
    gameCard: {
      backgroundColor: "#ffffff",
      width: "250px",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      overflow: "hidden",
      textAlign: "center",
      padding: "10px",
    },
    gameImage: {
      width: "100%",
      height: "150px",
      objectFit: "cover",
    },
    gameTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      margin: "10px 0",
    },
    gameDescription: {
      fontSize: "14px",
      color: "#555",
      marginBottom: "10px",
    },
    gamePrice: {
      fontSize: "16px",
      fontWeight: "bold",
      marginBottom: "10px",
    },
    purchaseButton: {
      backgroundColor: "#007bff",
      color: "#ffffff",
      padding: "10px",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "14px",
    },
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <input
        style={styles.searchBar}
        type="text"
        placeholder="Search games..."
        onChange={(e) => setSearch(e.target.value)}
        value={search}
      />
      <div style={styles.gameList}>
        {games
          .filter((game) => !purchasedGames.includes(game.id)) // Exclude purchased games
          .filter((game) => game.title.toLowerCase().includes(search.toLowerCase())) // Search filter
          .map((game) => (
            <div key={game.id} style={styles.gameCard}>
              <img
                src={game.image}
                alt={game.title}
                style={styles.gameImage}
              />
              <h2 style={styles.gameTitle}>{game.title}</h2>
              <p style={styles.gameDescription}>{game.description}</p>
              <p style={styles.gamePrice}>{game.price} ETH</p>
              <button
                style={styles.purchaseButton}
                onClick={() => handlePurchase(game)}
              >
                Purchase
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserHome;

