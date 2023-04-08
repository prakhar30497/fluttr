import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const CreatePost = (props) => {
  const { open, handleDialogClose, handleDialogSubmit } = props;
  const [message, setMessage] = useState("");

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
            placeholder="What's happening?"
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={(e) => handleDialogSubmit(message)}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreatePost;
