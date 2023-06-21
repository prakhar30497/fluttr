import React, { createContext, useContext, useState, useEffect } from "react";
import { getUser } from "../services/api";

const UserContext = createContext();

export const useUser = () => {
  return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState();

  const getCurrentUser = () => {
    getUser(localStorage.getItem(email)).then((data) => setUser(data));
  };

  const value = {
    user,
    getCurrentUser,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
