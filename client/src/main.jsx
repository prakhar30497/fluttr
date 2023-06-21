import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { AuthProvider } from "./hooks/AuthContext";
import { UserProvider } from "./hooks/UserContext";
import { DarkThemeProvider } from "./hooks/ThemeContext";
import App from "./components/App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <DarkThemeProvider>
        <Router history={history}>
          <App />
        </Router>
      </DarkThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
