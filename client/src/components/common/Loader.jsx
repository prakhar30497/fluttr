import React from "react";
import "../../styles/loader.css";
import { useTheme } from "../../hooks/ThemeContext";

export default function Loader() {
  const { isDarkMode } = useTheme();
  return (
    <div
      className={
        isDarkMode ? "spinner-container dark-mode" : "spinner-container"
      }
    >
      <div className="loading-spinner"></div>
    </div>
  );
}
