import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DarkModeContext } from "../contexts/DarkModeContext";

const Login = () => {
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);

  const handleLogin = () => {
    if (userType === "Developer") {
      navigate("/developer/home");
    } else if (userType === "Gamer") {
      navigate("/user/home");
    }
  };

  const styles = {
    container: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      backgroundColor: isDarkMode ? "#333333" : "#f4f4f9", // Dark mode background
      color: isDarkMode ? "#ffffff" : "#000000", // Text color
      fontFamily: "Arial, sans-serif",
    },
    card: {
      backgroundColor: isDarkMode ? "#444444" : "#ffffff", // Card background
      padding: "30px",
      borderRadius: "10px",
      boxShadow: isDarkMode
        ? "0 4px 6px rgba(0, 0, 0, 0.5)" // Softer shadow in dark mode
        : "0 4px 6px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
      width: "300px",
    },
    title: {
      fontSize: "24px",
      marginBottom: "20px",
      color: isDarkMode ? "#ffffff" : "#333333", // Title color
    },
    select: {
      width: "100%",
      padding: "10px",
      marginBottom: "20px",
      borderRadius: "5px",
      border: "1px solid #ddd",
      backgroundColor: isDarkMode ? "#555555" : "#ffffff", // Input background in dark mode
      color: isDarkMode ? "#ffffff" : "#000000",
    },
    button: {
      width: "100%",
      padding: "10px",
      backgroundColor: isDarkMode ? "#555555" : "#007bff", // Button color for dark mode
      color: "#ffffff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      fontSize: "16px",
    },
    buttonHover: {
      backgroundColor: isDarkMode ? "#777777" : "#0056b3",
    },
    toggleButton: {
      marginTop: "20px",
      padding: "10px",
      backgroundColor: "transparent", // Transparent background for toggle
      color: isDarkMode ? "#ffffff" : "#000000",
      border: "none",
      fontSize: "24px", // Larger font for symbol
      cursor: "pointer",
    },
  };


  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Game Marketplace Login</h1>
        <select
          style={styles.select}
          onChange={(e) => setUserType(e.target.value)}
          value={userType}
        >
          <option value="">Select User Type</option>
          <option value="Gamer">Gamer</option>
          <option value="Developer">Developer</option>
        </select>
        <button
          style={styles.button}
          onClick={handleLogin}
          onMouseOver={(e) => (e.target.style.backgroundColor = styles.buttonHover.backgroundColor)}
          onMouseOut={(e) => (e.target.style.backgroundColor = styles.button.backgroundColor)}
        >
          Login
        </button>
        <button
          style={styles.toggleButton}
          onClick={toggleDarkMode}
        >
          {isDarkMode ? "☀️" : "🌙"}
        </button>
      </div>
    </div>
  );
};

export default Login;
