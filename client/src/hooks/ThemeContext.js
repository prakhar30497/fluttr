import React, { createContext, useContext, useState, useEffect } from "react";
const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const DarkThemeProvider = ({ children }) => {
  const [isDarkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    setDarkMode(!isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
