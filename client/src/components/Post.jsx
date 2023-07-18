import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
import DrawerList from "./common/DrawerList";
import { usePost } from "../hooks/PostContext";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import Avatar from "@mui/material/Avatar";
import Comments from "./Comments";
import { stringAvatar, convertTime } from "../../utils/index";
import { useTheme } from "../hooks/ThemeContext";
import { useAuth } from "../hooks/AuthContext";
import { useAsyncFn } from "../hooks/useAsync";
import { togglePostLike } from "../services/api";

const Post = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { post, rootComments } = usePost();
  const { isDarkMode } = useTheme();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const toggleLikeFn = useAsyncFn(togglePostLike);

  const ref = useRef(null);

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const onToggleLike = (e, id) => {
    e.preventDefault();
    return toggleLikeFn
      .execute({
        userId: currentUser.id,
        postId: id,
      })
      .then(({ addLike }) => toggleLocalPostLike(id, addLike));
  };

  const toggleLocalPostLike = (id, addLike) => {
    if (addLike) {
      post.likes.push({
        userId: currentUser.id,
        postId: post.id,
      });
    } else {
      post.likes = post.likes.filter((like) => like.userId !== currentUser.id);
    }
  };

  function handleCommentIconClick() {
    ref.current?.focus();
  }

  return (
    <>
      {/* <CssBaseline /> */}
      {/* <Appbar handleDrawerOpen={handleDrawerOpen} />
      <DrawerList open={drawerOpen} handleDrawerClose={handleDrawerClose} /> */}
      <Container maxWidth="md" component="main" style={{ marginTop: "100px" }}>
        {/* <IconButton
          aria-label="Back"
          style={{ zIndex: 100, left: -40, top: -40 }}
          onClick={() => {
            navigate(`/`);
          }}
        >
          <ArrowBackIosNewIcon color="primary" />
        </IconButton> */}
        <Grid container direction={"column"} rowSpacing={2}>
          {post && (
            <Box>
              <Box
                padding={1}
                paddingLeft={0}
                sx={{ display: "flex", alignItems: "center" }}
              >
                <IconButton
                  aria-label="Back"
                  sx={{ marginRight: "1rem" }}
                  onClick={() => {
                    navigate(`/`);
                  }}
                >
                  <ArrowBackIosNewIcon color="primary" />
                </IconButton>
                <Typography variant="h5">Post</Typography>
              </Box>

              <Box
                padding={1}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Avatar
                  {...stringAvatar(post.user.name)}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/profile/${post.user.handle}`);
                  }}
                />
                <Box sx={{ marginRight: "auto" }}>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      textDecoration: "none",
                      "&:hover": { textDecoration: "underline" },
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      navigate(`/profile/${post.user.handle}`);
                    }}
                  >
                    {post.user.name}
                  </Typography>
                  <Box sx={{ display: "flex" }}>
                    <Typography variant="caption" color="#71767b">
                      @{post.user.handle}&nbsp;
                    </Typography>
                    <Typography variant="caption" color="#71767b">
                      &bull;&nbsp;{convertTime(post?.createdAt)}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              <Box padding={1}>
                <Typography variant="h4" sx={{ fontWeight: "500" }}>
                  {post?.title}
                </Typography>
              </Box>
              <Box padding={1} paddingBottom={3}>
                <Typography variant="body1">{post?.body}</Typography>
              </Box>
              <Box padding={1}>
                <Typography
                  variant="body1"
                  sx={{
                    color: "var(--light-gray)",
                  }}
                >
                  {convertTime(post?.createdAt, true)}
                </Typography>
              </Box>
            </Box>
          )}
          <Box
            padding={1}
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 4,
              borderTop: isDarkMode
                ? "1px solid var(--dark-border-gray)"
                : "1px solid var(--border-gray)",
              borderBottom: isDarkMode
                ? "1px solid var(--dark-border-gray)"
                : "1px solid var(--border-gray)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle2" paddingLeft={1}>
                {post.likes?.length}{" "}
                {post.likes?.length == 1 ? "Like" : "Likes"}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle2" paddingLeft={1}>
                {post.reposts?.length ? post.reposts?.length : 0}{" "}
                {post.reposts?.length == 1 ? "Repost" : "Reposts"}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle2" paddingLeft={1}>
                {post.comments?.length}{" "}
                {post.comments?.length == 1 ? "Comment" : "Comments"}
              </Typography>
            </Box>
          </Box>
          <Box
            padding={1}
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 8,
            }}
          >
            <IconButton
              aria-label="Like"
              size="small"
              onClick={(e) => onToggleLike(e, post.id)}
            >
              {post.likes.find((like) => like.userId === currentUser?.id) ? (
                <FavoriteIcon style={{ color: "#f91880" }} />
              ) : (
                <FavoriteBorderIcon style={{ color: "#f91880" }} />
              )}
            </IconButton>
            <IconButton aria-label="Repost" size="small">
              <SwapHorizIcon />
            </IconButton>
            <IconButton
              aria-label="Reply"
              size="small"
              onClick={handleCommentIconClick}
            >
              <ModeCommentOutlinedIcon color="primary" />
            </IconButton>
          </Box>
          {
            <div className="mt-4">
              <Comments comments={rootComments} ref={ref} />
            </div>
          }
        </Grid>
      </Container>
    </>
  );
};

export default Post;
