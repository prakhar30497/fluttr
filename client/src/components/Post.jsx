import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import GlobalStyles from "@mui/material/GlobalStyles";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Appbar from "./common/AppBar";
import { usePost } from "../hooks/PostContext";
import { useUser } from "../hooks/UserContext";

import Comments from "./Comments";

const Post = () => {
  const { post, rootComments } = usePost();

  return (
    <div>
      <CssBaseline />
      <Appbar />
      <Container maxWidth="md" component="main" style={{ marginTop: "100px" }}>
        <Grid container direction={"column"} rowSpacing={2}>
          {post && (
            <Box>
              <Box padding={1} paddingBottom={0}>
                <Typography variant="h6">{post.user.name}</Typography>
              </Box>
              <Box padding={1}>
                <Typography variant="body2">{post.body}</Typography>
              </Box>
            </Box>
          )}
          {
            <div className="mt-4">
              <Comments comments={rootComments} />
            </div>
          }
        </Grid>
      </Container>
    </div>
  );
};

export default Post;
