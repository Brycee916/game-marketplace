import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

const TransactionHistory = ({ userType, account, contract }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!contract || !account) return;

      try {
        // Fetch the user's library (game IDs) from the smart contract
        const gameTitles = await contract.methods.getUserLibrary(account).call();

        // Fetch details for each game from the contract
        const transactionData = await Promise.all(
          gameTitles.map(async (title) => {
            const gameDetails = Object.values(
              await contract.methods.getGame(title).call()
            );

            return {
              title: gameDetails[0],
              price: Web3.utils.fromWei(gameDetails[1], "ether"), // Convert price from wei to ETH
              walletAddress: account,
              date: new Date().toISOString(), // Placeholder for date (use logs for accurate timestamp if needed)
            };
          })
        );

        setTransactions(transactionData);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [contract, account]);

  return (
    <div style={styles.container}>
      <Navbar />
      <h1 style={styles.header}>
        {userType === "developer"
          ? "Developer Transaction History"
          : "User Transaction History"}
      </h1>
      <div style={styles.transactionContainer}>
        {loading ? (
          <p style={styles.noTransactions}>Loading transactions...</p>
        ) : transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <div key={index} style={styles.transaction}>
              <p style={styles.transactionTitle}>{transaction.title}</p>
              <p style={styles.transactionDetails}>
                {userType === "developer"
                  ? `Sold for ${transaction.price} ETH`
                  : `Purchased for ${transaction.price} ETH`}
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