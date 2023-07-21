import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Container from "@mui/material/Container";
import Appbar from "./common/AppBar";
import DrawerList from "./common/DrawerList";
import { useAsync, useAsyncFn } from "../hooks/useAsync";
import { createPost, getUser, getPosts } from "../services/api";
import CreatePost from "./CreatePost";
import PostList from "./PostList";
import { useAuth } from "../hooks/AuthContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import Loader from "./common/Loader";

import { io } from "socket.io-client";
import { Box, Typography } from "@mui/material";

// const socket = io("http://localhost:5000");
// socket.on("connect", () => {
//   console.log("connected");
// });

const Posts = () => {
  const [posted, setPosted] = useState(0);

  const { currentUser, getCurrentUser } = useAuth();
  const axiosPrivate = useAxiosPrivate();
  const navigate = useNavigate();
  // const { user, getCurrentUser } = useUser();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // useEffect(() => {
  //   getPosts().then((data) => setPosts(data));
  // }, [posted]);

  const {
    loading,
    error,
    value: posts,
  } = useAsync(() => getPosts(axiosPrivate), [posted]);

  // socket.on("receive-post", (newPost) => {
  //   console.log("new", newPost);
  //   // posts?.push(newPost);
  //   setPosted(posted + 1);
  // });

  const toggleLocalPostLike = (id, addLike) => {
    posts.forEach((post) => {
      if (post.id === id) {
        post.liked = !post.liked;
        if (addLike) {
          post.likes += 1;
        } else {
          post.likes -= 1;
        }
      }
    });
  };

  const handleFabClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const handleDialogSubmit = (title, body) => {
    createPost(axiosPrivate, currentUser.id, title, body).then((data) => {
      console.log(data);
      setPosted(posted + 1);
      // socket.emit("create-post", user.id, body);
    });
    setDialogOpen(false);
  };

  if (loading) return <Loader />;
  if (error) {
    navigate("/login");
    return;
  }

  return (
    <div style={{ height: "100%" }}>
      {/* <CssBaseline />
      <Appbar handleDrawerOpen={handleDrawerOpen} />
      <DrawerList open={drawerOpen} handleDrawerClose={handleDrawerClose} /> */}
      <Container
        maxWidth="md"
        component="main"
        style={{ marginTop: "100px", height: "100%" }}
      >
        {currentUser && (
          <Box style={{ display: "flex", gap: "0.6rem", padding: "1rem" }}>
            <Typography style={{ fontSize: "2rem", fontFamily: "Nirmala UI" }}>
              Hello,{" "}
            </Typography>
            <Typography
              style={{
                fontSize: "2rem",
                fontFamily: "Nirmala UI",
                fontWeight: "bold",
              }}
            >
              {currentUser?.name}
            </Typography>
          </Box>
        )}
        <PostList posts={posts} toggleLocalPostLike={toggleLocalPostLike} />
        <CreatePost
          open={dialogOpen}
          handleDialogClose={handleDialogClose}
          handleDialogSubmit={handleDialogSubmit}
        />
        <Fab
          color="primary"
          variant="extended"
          style={{
            top: "auto",
            left: "auto",
            bottom: 40,
            right: 40,
            position: "fixed",
          }}
          onClick={handleFabClick}
        >
          <AddIcon sx={{ mr: 1 }} />
          Create
        </Fab>
      </Container>
    </div>
  );
};

export default Posts;
