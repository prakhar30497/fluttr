import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import { useAsync } from "../hooks/useAsync";
import { useAuth } from "../hooks/AuthContext";
import {
  getUserProfile,
  checkFollower,
  addFollower,
  removeFollower,
} from "../services/api";
import PostList from "./PostList";
import EditProfile from "./EditProfile";
import { stringAvatar } from "../../utils/index";

const Profile = () => {
  const navigate = useNavigate();
  const { userHandle } = useParams();

  const { currentUser } = useAuth();
  const [following, setFollowing] = useState(false);
  const [numFollowers, setNumFollowers] = useState(0);
  const [numFollowing, setNumFollowing] = useState(0);
  const [openEditDialog, setOpenEditDialog] = useState(false);

  const {
    loading,
    error,
    value: profile,
  } = useAsync(() => getUserProfile(userHandle));

  useEffect(() => {
    checkFollower(currentUser?.id, profile?.user?.id).then((resp) => {
      resp && setFollowing(resp.isFollowing);
      if (resp?.data) {
        setNumFollowers(resp.data.followers);
        setNumFollowing(resp.data.following);
      }
    });
  }, [profile]);

  const handleFollow = () => {
    if (currentUser?.id && profile?.user?.id) {
      following
        ? removeFollower(currentUser?.id, profile?.user?.id).then((resp) => {
            if (resp?.data) {
              setFollowing(false);
              setNumFollowers(resp.data.followers);
              setNumFollowing(resp.data.following);
            }
          })
        : addFollower(currentUser?.id, profile?.user?.id).then((resp) => {
            if (resp?.data) {
              setFollowing(true);
              setNumFollowers(resp.data.followers);
              setNumFollowing(resp.data.following);
            }
          });
    }
  };

  const handleEditDialogOpen = () => {
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  };

  return (
    profile && (
      <>
        <Container
          maxWidth="md"
          component="main"
          style={{ marginTop: "100px" }}
        >
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
            <Typography variant="h5">Profile</Typography>
          </Box>
          <Box
            padding={1}
            paddingBottom={0}
            sx={{
              display: "flex",
              alignItems: "start",
              gap: 3,
            }}
          >
            {profile?.user?.name && (
              <Avatar {...stringAvatar(profile?.user?.name, "profile")} />
            )}
            <Box sx={{ marginRight: "auto" }}>
              <Typography variant="h5" fontWeight="medium">
                {profile?.user?.name}
              </Typography>
              <Typography variant="body1" color="#71767b" fontWeight="regular">
                @{profile?.user.handle}
              </Typography>
              <Typography
                variant="body1"
                color="text"
                fontWeight={300}
                paddingTop={2}
                paddingBottom={2}
              >
                {profile?.user.about}
              </Typography>
              {profile?.user.location && (
                <Box sx={{ display: "flex", gap: 1 }} paddingBottom={2}>
                  <PlaceOutlinedIcon fontSize="small" />
                  <Typography variant="subtitle2" fontWeight={400}>
                    {profile?.user.location}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: "flex", gap: 4 }}>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6">{profile?.posts?.length}</Typography>
                  <Typography variant="body1" fontWeight={400}>
                    Posts
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6">{numFollowers}</Typography>
                  <Typography variant="body1" fontWeight={400}>
                    Followers
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="h6">{numFollowing}</Typography>
                  <Typography variant="body1" fontWeight={400}>
                    Following
                  </Typography>
                </Box>
              </Box>
            </Box>
            {currentUser?.id &&
              (currentUser.id === profile?.user?.id ? (
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => handleEditDialogOpen()}
                >
                  Edit Profile
                </Button>
              ) : following ? (
                <Button
                  variant="outlined"
                  startIcon={<HowToRegIcon />}
                  onClick={handleFollow}
                >
                  Following
                </Button>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<PersonAddAlt1Icon />}
                  onClick={handleFollow}
                >
                  Follow
                </Button>
              ))}
          </Box>
          <Divider variant="fullWidth" sx={{ padding: "1rem" }} />
          <Box padding={1}>
            <Typography variant="h6">Posts</Typography>
          </Box>
          {profile?.posts && <PostList posts={profile.posts} />}
        </Container>
        <EditProfile
          open={openEditDialog}
          handleDialogClose={handleEditDialogClose}
          handleDialogSubmit={handleEditDialogClose}
          profile={profile.user}
        />
      </>
    )
  );
};

export default Profile;
