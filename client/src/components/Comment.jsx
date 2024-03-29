import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ReplyIcon from "@mui/icons-material/Reply";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import EditIcon from "@mui/icons-material/Edit";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { usePost } from "../hooks/PostContext";
import { useUser } from "../hooks/UserContext";
import { useAuth } from "../hooks/AuthContext";
import CommentForm from "./CommentForm";
import { stringAvatar, convertTime } from "../../utils/index";
import { useAsyncFn } from "../hooks/useAsync";
import {
  createComment,
  updateComment,
  deleteComment,
  toggleLike,
} from "../services/api";

const Comment = ({ id, message, user, createdAt, likeCount, likedByMe }) => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const isMyComment = currentUser?.id === user?.id;

  const [replying, setReplying] = useState(false);
  const [editing, setEditing] = useState(false);
  const {
    post,
    getReplies,
    createLocalComment,
    updateLocalComment,
    deleteLocalComment,
    toggleLocalCommentLike,
  } = usePost();

  const childComments = getReplies(id);

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const createCommentFn = useAsyncFn(createComment);
  const updateCommentFn = useAsyncFn(updateComment);
  const deleteCommentFn = useAsyncFn(deleteComment);
  const toggleLikeFn = useAsyncFn(toggleLike);

  const onCommentReply = (message) => {
    return createCommentFn
      .execute({
        userId: currentUser.id,
        postId: post.id,
        message,
        parentId: id,
      })
      .then((comment) => {
        setReplying(false);
        createLocalComment(comment);
      });
  };

  const onCommentUpdate = (message) => {
    return updateCommentFn
      .execute({
        userId: currentUser.id,
        postId: post.id,
        message,
        id,
      })
      .then((comment) => {
        setEditing(false);
        updateLocalComment(id, comment.message);
      });
  };

  const onCommentDelete = () => {
    return deleteCommentFn
      .execute({
        postId: post.id,
        id,
      })
      .then(deleteLocalComment(id));
  };

  const onToggleLike = () => {
    return toggleLikeFn
      .execute({
        userId: currentUser.id,
        postId: post.id,
        id,
      })
      .then(({ addLike }) => toggleLocalCommentLike(id, addLike));
  };

  return (
    <>
      <Paper elevation={1} style={{ marginBottom: "1rem" }} key={id}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "stretch",
          }}
          padding={1}
          paddingBottom={0}
        >
          {/* <Typography variant="subtitle2">{user.name}</Typography>
          <Typography variant="body2">
            {dateFormatter.format(Date.parse(createdAt))}
          </Typography> */}
          <Box
            sx={{
              marginRight: "auto",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                textDecoration: "none",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/profile/${user.handle}`);
              }}
            >
              {user.name}
            </Typography>
            <Box sx={{ display: "flex" }}>
              <Typography variant="caption" color="#71767b">
                @{user.handle}&nbsp;
              </Typography>
              <Typography variant="caption" color="#71767b">
                &bull;&nbsp;{convertTime(createdAt)}
              </Typography>
            </Box>
          </Box>
          <IconButton
            aria-label="More"
            onClick={() => {
              // setEditing(false);
              // setReplying((prev) => !prev);
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
        <Box padding={1}>
          <Typography variant="body2">{message}</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <IconButton
              aria-label="Like"
              size="small"
              onClick={onToggleLike}
              disabled={!currentUser}
            >
              {!!likedByMe && currentUser ? (
                <FavoriteIcon color="primary" />
              ) : (
                <FavoriteBorderIcon color="primary" />
              )}
            </IconButton>
            <Typography variant="subtitle2">{likeCount}</Typography>
          </Box>

          <IconButton
            aria-label="Reply"
            onClick={() => {
              setEditing(false);
              setReplying((prev) => !prev);
            }}
          >
            <ChatBubbleOutlineIcon color="primary" />
          </IconButton>
          <IconButton
            aria-label="Edit"
            onClick={() => {
              setReplying(false);
              setEditing((prev) => !prev);
            }}
            disabled={!isMyComment || !currentUser}
            size="small"
          >
            <EditIcon color={!isMyComment || !currentUser ? "" : "primary"} />
          </IconButton>
          <IconButton
            aria-label="Delete"
            disabled={!isMyComment || deleteCommentFn.loading || !currentUser}
            onClick={onCommentDelete}
          >
            <DeleteIcon color={!isMyComment || !currentUser ? "" : "error"} />
          </IconButton>
        </Box>
      </Paper>
      {replying && (
        <CommentForm
          rows={1}
          placeholder={`Reply to ${user.name}`}
          loading={createCommentFn.loading}
          error={createCommentFn.error}
          onSubmit={onCommentReply}
        />
      )}
      {editing && (
        <CommentForm
          rows={1}
          loading={updateCommentFn.loading}
          error={updateCommentFn.error}
          onSubmit={onCommentUpdate}
          initialValue={message}
        />
      )}
      <div
        style={{ paddingLeft: "2rem", borderLeft: "1px solid var(--primary" }}
      >
        {childComments &&
          childComments.map((childComment) => {
            return <Comment {...childComment} />;
          })}
      </div>
    </>
  );
};

export default Comment;
