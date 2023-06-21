import React, { useEffect, useState } from "react";
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
import { useUser } from "../hooks/UserContext";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import Comments from "./Comments";

const Post = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { post, rootComments } = usePost();
  const navigate = useNavigate();
  // const likedByMe = true;

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };
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
              <Box padding={1} paddingBottom={0}>
                <Typography variant="h6">{post?.user?.name}</Typography>
              </Box>
              <Box padding={1}>
                <Typography variant="body2">{post?.body}</Typography>
              </Box>
            </Box>
          )}
          {/* <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              borderTop: "1px solid var(--light-gray)",
              borderBottom: "1px solid var(--light-gray)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <IconButton aria-label="Like" size="small">
                {!!likedByMe ? (
                  <FavoriteIcon color="primary" />
                ) : (
                  <FavoriteBorderIcon color="primary" />
                )}
              </IconButton>
              <Typography variant="subtitle2">{0}</Typography>
            </Box>

            <IconButton aria-label="Reply">
              <ReplyIcon color="primary" />
            </IconButton>
            <IconButton aria-label="Edit" size="small">
              <EditIcon color={"primary"} />
            </IconButton>
            <IconButton aria-label="Delete">
              <DeleteIcon color={"error"} />
            </IconButton>
          </Box> */}
          {
            <div className="mt-4">
              <Comments comments={rootComments} />
            </div>
          }
        </Grid>
      </Container>
    </>
  );
};

export default Post;
