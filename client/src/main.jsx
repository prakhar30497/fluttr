import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { createBrowserHistory } from "history";
import { AuthProvider } from "./hooks/AuthContext";
import { UserProvider } from "./hooks/UserContext";
import App from "./components/App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <UserProvider>
      <AuthProvider>
        <Router history={history}>
          <App />
        </Router>
      </AuthProvider>
    </UserProvider>
  </React.StrictMode>
);
