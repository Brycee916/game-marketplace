import React, { useState, useContext } from "react";
import Navbar from "../components/Navbar";
import { DarkModeContext } from "../contexts/DarkModeContext";

const Profile = ({ userType, games }) => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [error, setError] = useState("");
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

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
      backgroundColor: isDarkMode ? "#333333" : "#f4f4f9", // Medium gray for dark mode
      color: isDarkMode ? "#ffffff" : "#000000", // White text in dark mode
      fontFamily: "Arial, sans-serif",
    },
    header: {
      fontSize: "24px",
      marginBottom: "20px",
      color: isDarkMode ? "#ffffff" : "#333333", // White header text in dark mode
    },
    walletInfo: {
      fontSize: "16px",
      marginBottom: "15px",
      color: walletAddress
        ? isDarkMode
          ? "#90ee90" // Light green for dark mode
          : "#2e7d32" // Dark green for light mode
        : isDarkMode
        ? "#ff6f61" // Soft red for dark mode
        : "#d32f2f", // Red for light mode
    },
    button: {
      padding: "10px 20px",
      backgroundColor: isDarkMode ? "#555555" : "#007bff", // Darker button for dark mode
      color: "#ffffff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
      boxShadow: isDarkMode
        ? "0 4px 6px rgba(0, 0, 0, 0.5)" // Softer shadow for dark mode
        : "0 4px 6px rgba(0, 0, 0, 0.1)",
    },
    buttonHover: {
      backgroundColor: isDarkMode ? "#777777" : "#0056b3", // Adjust hover for dark mode
    },
    error: {
      color: isDarkMode ? "#ff6f61" : "#d32f2f", // Red for errors
      fontSize: "14px",
      marginTop: "10px",
    },
    gamesContainer: {
      marginTop: "20px",
      padding: "20px",
      backgroundColor: isDarkMode ? "#444444" : "#ffffff", // Darker background for dark mode
      borderRadius: "10px",
      boxShadow: isDarkMode
        ? "0 4px 6px rgba(0, 0, 0, 0.5)" // Softer shadow for dark mode
        : "0 4px 6px rgba(0, 0, 0, 0.1)",
      width: "80%",
    },
    gameTile: {
      borderBottom: isDarkMode ? "1px solid #555555" : "1px solid #ddd", // Darker border in dark mode
      padding: "10px 0",
    },
    gameTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      color: isDarkMode ? "#ffffff" : "#000000", // White for dark mode
      marginBottom: "5px",
    },
    gameDescription: {
      fontSize: "14px",
      color: isDarkMode ? "#bbbbbb" : "#555555", // Softer gray for dark mode
    },
  };
  
  return (
    <div style={styles.container}>
      <Navbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode}  />
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
    </div>
  );
};

export default Profile;
