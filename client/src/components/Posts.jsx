import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Appbar from "./common/AppBar";
import { useAsync } from "../hooks/useAsync";
import { createPost, getUser, getPosts } from "../services/api";
import CreatePost from "./CreatePost";
import { useAuth } from "../hooks/AuthContext";
import { useUser } from "../hooks/UserContext";

const Posts = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [posted, setPosted] = useState(0);

  const { currentUser } = useAuth();
  const { user, getCurrentUser } = useUser();

  const [dialogOpen, setDialogOpen] = useState(false);

  // useEffect(() => {
  //   useAsync(getPosts).then((data) => console.log(data));
  // }, []);

  useEffect(() => {
    // getUser(currentUser.email).then((data) => setUser(data));
    getPosts().then((data) => setPosts(data));
  }, []);

  useEffect(() => {
    getCurrentUser(currentUser.email);
  }, [currentUser]);

  useEffect(() => {
    getPosts().then((data) => setPosts(data));
  }, [posted]);

  const handleFabClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleDialogSubmit = (body) => {
    createPost(user.id, body);
    setPosted(posted + 1);
    setDialogOpen(false);
  };

  if (loading) return <h1>Loading</h1>;
  if (error) return <h1>{error}</h1>;

  return (
    <div style={{ height: "100%" }}>
      <CssBaseline />
      <Appbar />
      <Container
        maxWidth="md"
        component="main"
        style={{ paddingTop: "50px", height: "100%" }}
      >
        <Grid
          container
          direction={"column"}
          rowSpacing={2}
          style={{ paddingBottom: "100px" }}
        >
          {posts &&
            posts.map((post) => {
              return (
                <Grid item xs={6} key={post.id}>
                  <Link
                    to={`/post/${post.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <Paper elevation={3}>
                      <Box padding={1} paddingBottom={0}>
                        <Typography variant="h6">{post.user.name}</Typography>
                      </Box>
                      <Box padding={1}>
                        <Typography variant="body2">{post.body}</Typography>
                      </Box>
                    </Paper>
                  </Link>
                </Grid>
              );
            })}
        </Grid>
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
