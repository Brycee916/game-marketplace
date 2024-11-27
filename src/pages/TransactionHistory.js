import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import contractABI from "../contracts/GameMarketplace.json";
import { ethers } from "ethers";

const contractAddress = "0x6DBa90e8166fbA73ac66CCe38F814cf6E5350B44";

const TransactionHistory = ({ userType }) => {
  const [transactions, setTransactions] = useState([]);
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
      fetchTransactions();
    }
  }, [marketplaceContract, signer]);

  const fetchTransactions = async () => {
    try {
      const userAddress = await signer.getAddress();

      // Fetch user transactions
      const userTransactions = await marketplaceContract.getUserTransactions(userAddress);

      // Fetch additional details for each transaction
      const formattedTransactions = await Promise.all(
        userTransactions.map(async (transaction) => {
          const gameDetails = await marketplaceContract.getGameById(transaction.gameId);
          return {
            title: gameDetails.title,
            price: ethers.utils.formatEther(gameDetails.price),
            date: new Date(transaction.timestamp * 1000),
            walletAddress: transaction.buyer,
          };
        })
      );

      setTransactions(formattedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#f9f9fc",
      fontFamily: "Arial, sans-serif",
    },
    header: {
      fontSize: "24px",
      marginBottom: "20px",
      color: "#333",
    },
    transactionContainer: {
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      padding: "20px",
      width: "80%",
      maxWidth: "800px",
    },
    transaction: {
      display: "flex",
      flexDirection: "column",
      padding: "15px",
      borderBottom: "1px solid #ddd",
    },
    transactionTitle: {
      fontSize: "18px",
      fontWeight: "bold",
      marginBottom: "5px",
      color: "#007bff",
    },
    transactionDetails: {
      fontSize: "14px",
      color: "#555",
    },
    noTransactions: {
      textAlign: "center",
      fontSize: "16px",
      color: "#999",
      marginTop: "20px",
    },
  };

  return (
    <div style={styles.container}>
      <Navbar />
      <h1 style={styles.header}>
        {userType === "developer"
          ? "Developer Transaction History"
          : "User Transaction History"}
      </h1>
      <div style={styles.transactionContainer}>
        {transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <div key={index} style={styles.transaction}>
              <p style={styles.transactionTitle}>{transaction.title}</p>
              <p style={styles.transactionDetails}>
                {userType === "developer"
                  ? `Sold for ${transaction.price} ETH`
                  : `Purchased for ${transaction.price} ETH`}
              </p>
              <p style={styles.transactionDetails}>
                Date: {transaction.date.toLocaleDateString()}
              </p>
              <p style={styles.transactionDetails}>
                Wallet Address: {transaction.walletAddress}
              </p>
            </div>
          ))
        ) : (
          <p style={styles.noTransactions}>No transactions found</p>
        )}
      </div>
    </div>
  );
};

export default TransactionHistory;

