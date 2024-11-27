import React, { useState } from "react";
import contractABI from "../contracts/GameMarketplace.json"; 
import { ethers } from "ethers";

const contractAddress = "0x6DBa90e8166fbA73ac66CCe38F814cf6E5350B44"; //replace this with new contract address

const DeveloperHome = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState("");
  const [game, setGame] = useState({
    title: "",
    price: 0,
    description: "",
    image: "",
    developerAddress: "", // Add developer's Ethereum public address
  });

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const marketplaceContract = new ethers.Contract(contractAddress, contractABI.abi, signer);
  
  const connectWallet = async (e) => {
    e.preventDefault();
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const address = accounts[0];
        setWalletAddress(address);

        // Update developerAddress in the game object
        setGame((prevGame) => ({
          ...prevGame,
          developerAddress: address,
        }));

        setError("");
      } catch (err) {
        setError("Failed to connect wallet. Please try again.");
      }
    } else {
      setError("MetaMask is not installed. Please install it to use this feature.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGame((prevGame) => ({
      ...prevGame,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    //--
    try {
        const transaction = await marketplaceContract.addGame(game.title, ethers.utils.parseEther(game.price), game.description, game.image);
        await transaction.wait();
        alert(`Details of Game Posted for Sale:\nTitle: ${game.title}\nPrice: ${game.price} ETH`);
        // Reset form fields after submission
        setGame({title: "", price: 0, description: "", image: "", developerAddress: walletAddress,});
    } catch (error) {
        alert(`Error Posting Game: ${game.title}`);
    }
    //--
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
    header: {
      fontSize: "24px",
      marginBottom: "20px",
      color: "#333",
    },
    form: {
      backgroundColor: "#ffffff",
      padding: "30px",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      width: "400px",
    },
    input: {
      width: "100%",
      padding: "10px",
      marginBottom: "15px",
      borderRadius: "5px",
      border: "1px solid #ddd",
      fontSize: "16px",
    },
    button: {
      width: "100%",
      padding: "10px",
      backgroundColor: "#007bff",
      color: "#ffffff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
    },
    button2: {
      padding: "5px 10px",
      backgroundColor: "#007bff",
      color: "#ffffff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "14px",
      marginBottom: "15px",
    },
    smallButton: {
      fontSize: "14px",
      padding: "5px 10px",
      marginBottom: "15px",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>Developer Home</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          style={styles.input}
          type="text"
          name="title"
          placeholder="Game Title"
          value={game.title}
          onChange={handleInputChange}
          required
        />
        <input
          style={styles.input}
          type="number"
          min="0"
          step="0.0001"
          name="price"
          placeholder="Price (in ETH)"
          value={game.price}
          onChange={handleInputChange}
          required
        />
        <textarea
          style={styles.input}
          name="description"
          placeholder="Game Description"
          value={game.description}
          onChange={handleInputChange}
          rows="4"
          required
        />
        <input
          style={styles.input}
          type="text"
          name="image"
          placeholder="Image URL"
          value={game.image}
          onChange={handleInputChange}
          required
        />
	<button
	  style={{ ...styles.button2, ...styles.smallButton }}
	  onClick={connectWallet}
	  onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
	  onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
	  Get my wallet address
        </button>
        <input
          style={styles.input}
          type="text"
          name="developerAddress"
          placeholder="Your Ethereum Public Address"
          value={game.developerAddress}
          required
        />
        <button
          style={styles.button}
          type="submit"
          onMouseOver={(e) =>
            (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)
          }
          onMouseOut={(e) =>
            (e.target.style.backgroundColor = styles.button.backgroundColor)
          }
        >
          Post Game
        </button>
      </form>
    </div>
  );
};

export default DeveloperHome;


