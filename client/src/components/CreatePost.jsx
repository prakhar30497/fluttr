import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputAdornment from "@mui/material/InputAdornment";
import { useAuth } from "../hooks/AuthContext";

const CreatePost = (props) => {
  const { open, handleDialogClose, handleDialogSubmit } = props;

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [titleError, setTitleError] = useState(false);
  const [bodyError, setBodyError] = useState(false);

  const errors = {
    title: "Input upto 50 characters",
    body: "Input upto 300 characters",
  };

  const { currentUser } = useAuth();

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    e.target.value.length > 50 ? setTitleError(true) : setTitleError(false);
  };
  const handleBodyChange = (e) => {
    setBody(e.target.value);
    e.target.value.length > 300 ? setBodyError(true) : setBodyError(false);
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
            rows={1}
            id="title"
            fullWidth
            variant="outlined"
            value={title}
            label={"Title"}
            placeholder={"Title (Optional)"}
            onChange={handleTitleChange}
            error={titleError}
            helperText={titleError && errors.title}
            InputProps={
              titleError && {
                endAdornment: (
                  <InputAdornment position="start">
                    {title.length}/50
                  </InputAdornment>
                ),
              }
            }
          />
          <TextField
            autoFocus
            margin="dense"
            multiline
            rows={8}
            id="body"
            fullWidth
            variant="outlined"
            value={body}
            placeholder={currentUser ? "What's happening?" : "Login to Post"}
            onChange={handleBodyChange}
            error={bodyError}
            helperText={bodyError && errors.body}
            InputProps={
              bodyError && {
                endAdornment: (
                  <InputAdornment position="start">
                    {body.length}/300
                  </InputAdornment>
                ),
              }
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={(e) => handleDialogSubmit(title, body)}
            disabled={!currentUser || !body || titleError || bodyError}
          >
            Post
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CreatePost;
