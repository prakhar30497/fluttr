import React, { useState, useEffect } from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import "../App.css";
import Login from "./Login";
import Signup from "./Signup";
import Posts from "./Posts";
import Post from "./Post";
import { useAuth } from "../hooks/AuthContext";
import { useUser } from "../hooks/UserContext";
import { PostProvider } from "../hooks/PostContext";

function App() {
  const { currentUser } = useAuth();
  const { user } = useUser();

  return (
    <div className="App">
      <Routes>
        <Route
          path="/login"
          exact
          element={currentUser ? <Navigate replace to={"/"} /> : <Login />}
        />
        <Route
          path="/signup"
          element={currentUser ? <Navigate replace to={"/"} /> : <Signup />}
        />
        <Route
          path="/"
          element={currentUser ? <Posts /> : <Navigate replace to={"/login"} />}
        />
        <Route
          path="/post/:id"
          element={
            currentUser && user ? (
              <PostProvider>
                <Post />
              </PostProvider>
            ) : (
              <Navigate replace to={"/"} />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
