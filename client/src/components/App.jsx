import React, { useState, useEffect } from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import "../App.css";
import Login from "./Login";
import Signup from "./Signup";
import Posts from "./Posts";
import Post from "./Post";
import { useAuth } from "../hooks/AuthContext";
import { PostProvider } from "../hooks/PostContext";

function App() {
  const { currentUser } = useAuth();

  return (
    <div className="App">
      <Routes>
        <Route path="/login" exact element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={currentUser ? <Posts /> : <Navigate replace to={"/login"} />}
        />
        <Route
          path="/post/:id"
          element={
            currentUser ? (
              <PostProvider>
                <Post />
              </PostProvider>
            ) : (
              <Navigate replace to={"/login"} />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;
