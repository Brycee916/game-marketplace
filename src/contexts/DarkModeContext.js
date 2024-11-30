import React, { createContext, useState, useEffect } from "react";

// Create the context
export const DarkModeContext = createContext();

// Provider component
export const DarkModeProvider = ({ children }) => {
const [isDarkMode, setIsDarkMode] = useState(() => {
    // Load dark mode state from localStorage if available
    const storedPreference = localStorage.getItem("darkMode");
    return storedPreference ? JSON.parse(storedPreference) : false;
});

  // Save dark mode state to localStorage whenever it changes
useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(isDarkMode));
}, [isDarkMode]);

const toggleDarkMode = () => setIsDarkMode((prev) => !prev);

return (
    <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
    {children}
    </DarkModeContext.Provider>
);
};