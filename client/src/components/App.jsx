import React, { useState, useEffect } from "react";
import { Route, Navigate, Routes } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "../App.css";
import Login from "./Login";
import Signup from "./Signup";
import Posts from "./Posts";
import Post from "./Post";
import { useAuth } from "../hooks/AuthContext";
import { useUser } from "../hooks/UserContext";
import { PostProvider } from "../hooks/PostContext";
import { useTheme } from "../hooks/ThemeContext";
import Appbar from "./common/AppBar";
import DrawerList from "./common/DrawerList";
import Groups from "./Groups";
import Messages from "./Messages";
import Profile from "./Profile";
import Settings from "./Settings";

function App() {
  const { currentUser } = useAuth();
  // const { user } = useUser();
  const { isDarkMode } = useTheme();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const appStyle = {
    // height: "100vh",
    // color: "#fff",
    // backgroundColor: "#121212",
  };

  const darkTheme = createTheme({
    palette: {
      mode: isDarkMode ? "dark" : "light",
    },
  });

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <div
        style={appStyle}
        // className="App"
      >
        <CssBaseline />
        <Appbar handleDrawerOpen={handleDrawerOpen} />
        <DrawerList open={drawerOpen} handleDrawerClose={handleDrawerClose} />
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
          <Route path="/" element={<Posts />} />
          <Route
            path="/post/:id"
            element={
              <PostProvider>
                <Post />
              </PostProvider>
            }
          />
          <Route path="/groups" element={<Groups />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/profile/:userHandle" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
