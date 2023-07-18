import React from "react";
import { useNavigate, Link } from "react-router-dom";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ForumOutlinedIcon from "@mui/icons-material/ForumOutlined";
import ModeCommentOutlinedIcon from "@mui/icons-material/ModeCommentOutlined";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { stringAvatar, convertTime } from "../../utils/index";
import { togglePostLike } from "../services/api";
import { useAsyncFn } from "../hooks/useAsync";
import { useAuth } from "../hooks/AuthContext";

const PostList = ({ posts, toggleLocalPostLike }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const toggleLikeFn = useAsyncFn(togglePostLike);

  const onToggleLike = (e, id) => {
    e.preventDefault();
    return toggleLikeFn
      .execute({
        userId: currentUser.id,
        postId: id,
      })
      .then(({ addLike }) => toggleLocalPostLike(id, addLike));
  };

  return (
    <Grid container direction={"column"} style={{ paddingBottom: "100px" }}>
      {posts?.length ? (
        posts.map((post) => {
          return (
            <Grid item xs={6} key={post.id} margin={1}>
              <Link to={`/post/${post.id}`} style={{ textDecoration: "none" }}>
                <Card>
                  <CardActionArea
                    sx={{
                      boxShadow: 1,
                      borderRadius: 2,
                      p: 1,
                    }}
                  >
                    <Box
                      padding={1}
                      paddingBottom={0}
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
                    <Box padding={1} paddingTop={2} paddingLeft={7}>
                      <Typography variant="h6" fontWeight="regular">
                        {post?.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          display: "-webkit-box",
                          overflow: "hidden",
                          WebkitBoxOrient: "vertical",
                          WebkitLineClamp: 4,
                        }}
                      >
                        {post.body}
                      </Typography>
                    </Box>
                    <Box
                      paddingLeft={6}
                      marginTop={1}
                      marginBottom={1}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "2rem",
                        justifyContent: "start",
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
                          onClick={(e) => onToggleLike(e, post.id)}
                        >
                          {post.liked ? (
                            <FavoriteIcon
                              style={{ color: "#f91880" }}
                              sx={{ fontSize: "20px" }}
                            />
                          ) : (
                            <FavoriteBorderIcon
                              style={{ color: "#f91880" }}
                              sx={{ fontSize: "20px" }}
                            />
                          )}
                        </IconButton>
                        {post.likes > 0 && (
                          <Typography
                            variant="subtitle2"
                            paddingLeft={1}
                            sx={{ fontSize: "12px" }}
                          >
                            {post.likes}
                          </Typography>
                        )}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <IconButton
                          aria-label="Repost"
                          // onClick={() => {
                          //   setReplying(false);
                          //   setEditing((prev) => !prev);
                          // }}
                          // disabled={!isMyComment || !authUser}
                          size="small"
                        >
                          <SwapHorizIcon
                            style={{ color: "#00ba7c" }}
                            sx={{ fontSize: "20px" }}
                          />
                        </IconButton>
                        {post.reposts?.length > 0 && (
                          <Typography
                            variant="subtitle2"
                            paddingLeft={1}
                            sx={{ fontSize: "12px" }}
                          >
                            {post.reposts?.length}
                          </Typography>
                        )}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <IconButton
                          aria-label="Reply"
                          size="small"
                          // onClick={() => {
                          //   setEditing(false);
                          //   setReplying((prev) => !prev);
                          // }}
                        >
                          <ModeCommentOutlinedIcon
                            sx={{ fontSize: "20px" }}
                            color="primary"
                          />
                        </IconButton>
                        {post.comments > 0 && (
                          <Typography
                            variant="subtitle2"
                            paddingLeft={1}
                            sx={{ fontSize: "12px" }}
                          >
                            {post.comments}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </CardActionArea>
                </Card>
              </Link>
            </Grid>
          );
        })
      ) : (
        <Typography variant="body1" fontWeight="regular">
          No Posts Yet
        </Typography>
      )}
    </Grid>
  );
};

export default PostList;
