import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { register, createUser, getUser, loginUser } from "../services/api";
import { useUser } from "./UserContext";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState({});
  const [currentUser, setCurrentUser] = useState();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  const getCurrentUser = () => {
    getUser(localStorage.getItem("email")).then((data) => setCurrentUser(data));
  };

  function signup(username, email, password) {
    return register(username, email, password);
    // .then((userCredential) => {
    //   console.log("username", username);
    //   createUser(username, email);
    // })
    // .catch((error) => {
    //   const errorCode = error.code;
    //   const errorMessage = error.message;
    //   return { errorCode, errorMessage };
    // });
    // return createUserWithEmailAndPassword(auth, email, password)
    //   .then((userCredential) => {
    //     console.log("username", username);
    //     createUser(username, email);
    //   })
    //   .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     return { errorCode, errorMessage };
    //   });
  }

  function login(email, password) {
    return loginUser(email, password).then((data) => {
      const { accessToken, refreshToken } = data;
      setAuthState({ ...authState, accessToken });
      // localStorage.setItem("accessToken", accessToken);
      // localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("email", email);

      getUser(email, accessToken).then((data) => setCurrentUser(data));
    });
    // return signInWithEmailAndPassword(auth, email, password)
    //   .then((userCredential) => {
    //     // Signed in
    //     // getCurrentUser(email);
    //     getUser(email).then((data) => setUser(data));
    //     // ...
    //   })
    //   .catch((error) => {
    //     const errorCode = error.code;
    //     const errorMessage = error.message;
    //     return { errorCode, errorMessage };
    //   });
  }

  function logout() {
    // return signOut(auth);
    setAuthState({});
    setCurrentUser(null);
  }

  function resetPassword(email) {
    return auth.sendPasswordResetEmail(email);
  }

  function updateEmail(email) {
    return currentUser.updateEmail(email);
  }

  function updatePassword(password) {
    return currentUser.updatePassword(password);
  }

  useEffect(() => {
    setCurrentUser(user);
    setLoading(false);
  }, [user]);

  const value = {
    user,
    currentUser,
    getCurrentUser,
    login,
    signup,
    logout,
    authState,
    setAuthState,
    resetPassword,
    updateEmail,
    updatePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
