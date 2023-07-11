import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import TextField from "@mui/material/TextField";
import InputBase from "@mui/material/InputBase";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import SendIcon from "@mui/icons-material/Send";
import MessagesList from "./MessagesList";
import { stringAvatar, debounce } from "../../utils/index";
import { useAsync, useAsyncFn } from "../hooks/useAsync";
import SearchField from "./common/SearchField";
import { searchUsers, getAllChats, startChat } from "../services/api";
import Chat from "./Chat";
import { io } from "socket.io-client";
import { useAuth } from "../hooks/AuthContext";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Messages = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const axiosPrivate = useAxiosPrivate();

  // const [users, setUsers] = useState([]);
  const [searchResult, setSearchResult] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const socket = useRef();

  // useEffect(() => {
  //   getAllChats(axiosPrivate).then((data) => setChats(data));
  // }, []);

  const {
    loading,
    error,
    value: chats,
  } = useAsync(() => getAllChats(axiosPrivate), []);

  // useEffect(() => {
  //   socket.current = io(import.meta.env.VITE_SERVER_URL);
  //   currentUser?.id && socket.current.emit("addUser", currentUser.id);
  // }, [currentUser]);

  const handleSearch = debounce((query) => {
    query &&
      searchUsers(query, currentUser.id).then((data) =>
        setSearchResult(data?.users)
      );
  });

  const handleNewChat = () => {
    startChat(axiosPrivate, [currentUser?.id, selectedUser?.id]).then();
  };

  if (error) {
    navigate("/login");
    return;
  }

  return (
    <>
      <Container
        fixed
        maxWidth="lg"
        component="main"
        sx={{ padding: "100px", paddingBottom: "50px", height: "100vh" }}
      >
        <Box paddingLeft={0} sx={{ display: "flex", alignItems: "center" }}>
          <IconButton
            aria-label="Back"
            sx={{ marginRight: "1rem" }}
            onClick={() => {
              navigate(`/`);
            }}
          >
            <ArrowBackIosNewIcon color="primary" />
          </IconButton>
          <Typography variant="h5">Messages</Typography>
        </Box>
        <Grid container sx={{ height: "100%" }}>
          <Grid item xs={6} md={3} padding={2}>
            {/* <SearchField
              handleSearch={handleSearch}
              searchResult={searchResult}
              addUser={addUser}
            /> */}
            <MessagesList
              users={chats}
              handleSearch={handleSearch}
              searchResult={searchResult}
              setSearchResult={setSearchResult}
              setSelectedUser={setSelectedUser}
            />
          </Grid>
          <Divider
            variant="fullWidth"
            orientation="vertical"
            flexItem
            sx={{ mr: "-1px" }}
          />
          {selectedUser && (
            <Grid item xs={6} md={9} padding={2} sx={{ height: "100%" }}>
              <Chat
                selectedUser={selectedUser}
                setSelectedUser={setSelectedUser}
                handleNewChat={handleNewChat}
              />
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default Messages;
