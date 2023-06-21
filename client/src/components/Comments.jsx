import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { useAsyncFn } from "../hooks/useAsync";
import { createComment } from "../services/api";
import { useAuth } from "../hooks/AuthContext";
import { usePost } from "../hooks/PostContext";

const Comments = ({ comments }) => {
  const { post, createLocalComment } = usePost();
  const { currentUser } = useAuth();

  const {
    loading,
    error,
    execute: createCommentFn,
  } = useAsyncFn(createComment);

  function onCreateComment(message) {
    return createCommentFn({
      userId: currentUser.id,
      postId: post.id,
      message,
    }).then(createLocalComment);
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
            return <Comment {...comment} key={comment.id} />;
          })}
        <Paper elevation={3}></Paper>
      </Grid>
    </div>
  );
};

export default Comments;
