import React, { useEffect } from "react";
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
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { useAsyncFn } from "../hooks/useAsync";
import { createComment } from "../services/api";
import { useUser } from "../hooks/UserContext";
import { usePost } from "../hooks/PostContext";
import { useAuth } from "../hooks/AuthContext";

const Comments = ({ comments }) => {
  const { post, createLocalComment } = usePost();
  const { currentUser } = useAuth();
  const { user, getCurrentUser } = useUser();

  useEffect(() => {
    getCurrentUser(currentUser.email);
  }, [currentUser]);

  const {
    loading,
    error,
    execute: createCommentFn,
  } = useAsyncFn(createComment);

  function onCreateComment(message) {
    return createCommentFn({ userId: user.id, postId: post.id, message }).then(
      createLocalComment
    );
  }

  return (
    <div>
      <Box padding={1}>
        <Typography variant="h6">Comments</Typography>
      </Box>
      <CommentForm
        rows={2}
        loading={loading}
        error={error}
        onSubmit={onCreateComment}
      />
      <Grid item>
        {comments &&
          comments.map((comment) => {
            return <Comment {...comment} />;
          })}
        <Paper elevation={3}></Paper>
      </Grid>
    </div>
  );
};

export default Comments;
