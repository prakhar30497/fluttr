import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useAuth } from "../hooks/AuthContext";

const CreatePost = (props) => {
  const { open, handleDialogClose, handleDialogSubmit } = props;
  const [message, setMessage] = useState("");
  const { currentUser } = useAuth();

  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  return (
    <div>
      <Dialog
        open={open}
        maxWidth="md"
        fullWidth
        onClose={() => handleDialogClose}
      >
        <DialogTitle>Create Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            multiline
            rows={4}
            id="name"
            fullWidth
            variant="outlined"
            value={message}
            placeholder={currentUser ? "What's happening?" : "Login to Post"}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={(e) => handleDialogSubmit(message)}
            disabled={!currentUser || !message}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreatePost;
