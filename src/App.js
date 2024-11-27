import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import UserHome from "./pages/UserHome";
import DeveloperHome from "./pages/DeveloperHome";
import WalletIntegration from "./pages/WalletIntegration";
import Profile from "./pages/Profile";
import TransactionHistory from "./pages/TransactionHistory";
import Web3 from 'web3';
import { getGameMarketplaceContract } from './utils/getContract';

const App = () => {
  const [account, setAccount] = useState('');
  const [contract, setContract] = useState(null);

  // Sample data for TransactionHistory
  const transactions = [
    {
      title: "Space Invaders",
      price: "0.05",
      date: "2024-11-15T10:30:00Z",
      walletAddress: "0x1234567890abcdef...",
    },
    {
      title: "Alien Adventure",
      price: "0.08",
      date: "2024-11-16T14:45:00Z",
      walletAddress: "0xabcdef1234567890...",
    },
  ];

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        try {
          // Request account access
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const web3 = new Web3(window.ethereum);
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);

          // Use the utility function to get contract
          const contractInstance = await getGameMarketplaceContract();
          setContract(contractInstance);
        } catch (error) {
          console.error("User denied account access or error initializing", error);
        }
      }
      else {
        console.log('Non-Ethereum browser detected. Consider trying MetaMask!');
      }
    };

    initWeb3();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user/home" element={<UserHome />} />
        <Route path="/developer/home" element={<DeveloperHome />} />
        <Route path="/user/wallet" element={<WalletIntegration />} />
        <Route path="/user/profile" element={<Profile userType="user" walletAddress="0x123..." games={[]} />} />
        <Route path="/user/transaction-history" element={<TransactionHistory userType="user" account={account} contract={contract} />} />
      </Routes>
    </Router>
  );
};

export default App;

