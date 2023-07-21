import React, { useEffect, useRef, useState } from "react";
import TextField from "@mui/material/TextField";
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
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { io } from "socket.io-client";
import { stringAvatar } from "../../utils/index";
import { useAuth } from "../hooks/AuthContext";
import { useTheme } from "../hooks/ThemeContext";
import { useAsync, useAsyncFn } from "../hooks/useAsync";
import { startChat, getChatMessages } from "../services/api";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Chat = ({ selectedUser, setSelectedUser }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { currentUser } = useAuth();
  const { isDarkMode } = useTheme();
  const scrollRef = useRef();
  const axiosPrivate = useAxiosPrivate();
  const socket = useRef();

  const handleNewChat = () => {
    // setClickStartChat(true);
    startChat(axiosPrivate, [currentUser?.id, selectedUser?.id]).then((data) =>
      setSelectedUser({ ...selectedUser, chatId: data.chatId })
    );
  };

  useEffect(() => {
    socket.current = io(import.meta.env.VITE_SERVER_URL);
    currentUser?.id && socket.current.emit("addUser", currentUser.id);
  }, []);

  useEffect(() => {
    getChatMessages(axiosPrivate, selectedUser.chatId).then((data) =>
      setMessages(data)
    );
  }, [selectedUser]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
    socket.current.on("getMessage", ({ senderId, content }) => {
      // Display the received message in the chat window
      setMessages([...messages, { senderId, content }]);
    });
  }, [messages]);

  const sendMessage = () => {
    if (message && selectedUser.id) {
      socket.current.emit("chatMessage", {
        chatId: selectedUser.chatId,
        senderId: currentUser.id,
        recipientId: selectedUser.id,
        content: message,
      });
      setMessages([
        ...messages,
        { content: message, senderId: currentUser.id },
      ]);
      setMessage("");
    }
  };

  return (
    <Paper elevation={1} sx={{ height: "100%" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          flexWrap: "nowrap",
        }}
      >
        <Box
          sx={{
            flexShrink: 0,
          }}
        >
          <Box
            padding={1}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "0.6rem",
            }}
          >
            <Avatar {...stringAvatar(selectedUser.name)} />
            <Typography variant="h6">{selectedUser.name}</Typography>
          </Box>
          <Divider variant="fullWidth" flexItem sx={{ mr: "-1px" }} />
        </Box>

        <Box
          padding={1}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            alignItems: "flex-start",
            flexGrow: 1,
            overflowY: selectedUser?.chatId && "scroll",
          }}
        >
          {selectedUser?.chatId ? (
            messages?.map((message, index) => {
              return (
                <Box
                  ref={scrollRef}
                  key={index}
                  padding={1}
                  sx={{
                    backgroundColor:
                      message.senderId === currentUser?.id
                        ? "#1d9bf0"
                        : isDarkMode
                        ? "#2f3336"
                        : "#f5f5f5",
                    alignSelf:
                      message.senderId === currentUser?.id
                        ? "flex-end"
                        : "flex-start",
                    borderRadius: "10px",
                    padding: "10px",
                    color:
                      message.senderId !== currentUser?.id && !isDarkMode
                        ? "#000000"
                        : "#fff",
                  }}
                >
                  <ListItemText primary={message.content} />
                </Box>
              );
            })
          ) : (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
                width: "100%",
              }}
            >
              <Button
                variant="contained"
                endIcon={<SendIcon />}
                onClick={handleNewChat}
              >
                Start Chat
              </Button>
            </Box>
          )}
        </Box>
        {selectedUser.chatId && (
          <Box
            padding={1}
            sx={{
              display: "flex",
              gap: "0.6rem",
              flexShrink: 0,
            }}
          >
            <TextField
              autoFocus
              margin="dense"
              multiline
              rows={1}
              id="message"
              fullWidth
              variant="outlined"
              value={message}
              placeholder={"New Message"}
              onChange={(e) => setMessage(e.target.value)}
            />
            <IconButton
              color="primary"
              aria-label="Send"
              size="small"
              onClick={sendMessage}
            >
              <SendIcon />
            </IconButton>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default Chat;
