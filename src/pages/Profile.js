import React, { useState } from "react";
import Navbar from "../components/Navbar";

const Profile = ({ userType, games }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState("");

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        setError("");
      } catch (err) {
        setError("Failed to connect wallet. Please try again.");
      }
    } else {
      setError("MetaMask is not installed. Please install it to use this feature.");
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f4f4f9",
      fontFamily: "Arial, sans-serif",
    },
    header: {
      fontSize: "24px",
      marginBottom: "20px",
      color: "#333",
    },
    walletInfo: {
      fontSize: "16px",
      marginBottom: "15px",
      color: walletAddress ? "#2e7d32" : "#d32f2f",
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#007bff",
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
    error: {
      color: "#d32f2f",
      fontSize: "14px",
      marginTop: "10px",
    },
    gamesContainer: {
      marginTop: "20px",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      width: "80%",
    },
    gameTile: {
      borderBottom: "1px solid #ddd",
      padding: "10px 0",
    },
    gameTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "5px",
    },
    gameDescription: {
      fontSize: "14px",
      color: "#555",
    },
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <h1 style={styles.header}>
        {userType === "developer" ? "Developer Profile" : "User Profile"}
      </h1>
      
      {/* Wallet Info Section */}
      {walletAddress ? (
        <p style={styles.walletInfo}>Connected Wallet: {walletAddress}</p>
      ) : (
        <p style={styles.walletInfo}>No Wallet Connected</p>
      )}
      <button
        style={styles.button}
        onClick={connectWallet}
        onMouseOver={(e) =>
          (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)
        }
        onMouseOut={(e) =>
          (e.target.style.backgroundColor = styles.button.backgroundColor)
        }
      >
        Connect Wallet
      </button>
      {error && <p style={styles.error}>{error}</p>}
      
      {/* Games Section */}
      <div style={styles.gamesContainer}>
        <h2>Your {userType === "developer" ? "Posted Games" : "Purchased Games"}</h2>
        {games && games.length > 0 ? (
          games.map((game, index) => (
            <div key={index} style={styles.gameTile}>
              <p style={styles.gameTitle}>{game.title}</p>
              <p style={styles.gameDescription}>{game.description}</p>
            </div>
          ))
        ) : (
          <p>No games available</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
