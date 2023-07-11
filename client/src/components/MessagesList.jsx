import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { stringAvatar } from "../../utils/index";

const MessagesList = ({
  users,
  handleSearch,
  searchResult,
  setSearchResult,
  setSelectedUser,
}) => {
  const [chatUsers, setChatUsers] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    setChatUsers(users);
  }, [users]);

  const addUser = (user) => {
    setSearchResult([]);
    if (!chatUsers.find((u) => u.id === user.id))
      setChatUsers([...chatUsers, user]);
  };

  const selectUser = (index) => {
    setSelectedIndex(index);
    setSelectedUser(chatUsers[index]);
  };

  return (
    <Box>
      <Autocomplete
        freeSolo
        id="search-input"
        disableClearable
        options={searchResult}
        getOptionLabel={(option) => option?.handle}
        onInputChange={(event, value) => handleSearch(value)}
        onChange={(event, value) => addUser(value)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search"
            InputProps={{
              ...params.InputProps,
              type: "search",
            }}
          />
        )}
      />
      {chatUsers && (
        <List>
          {chatUsers.map((user, index) => {
            return (
              <ListItemButton
                disablePadding
                key={user.id}
                selected={selectedIndex === index}
                onClick={(e) => selectUser(index)}
              >
                <ListItemAvatar>
                  <Avatar {...stringAvatar(user.name)} />
                </ListItemAvatar>
                <ListItemText>{user.name}</ListItemText>
              </ListItemButton>
            );
          })}
        </List>
      )}
    </Box>
  );
};

export default MessagesList;
