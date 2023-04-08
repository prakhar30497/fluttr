import React, { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";

const CommentForm = ({ rows, loading, error, onSubmit, initialValue = "" }) => {
  const [message, setMessage] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(message).then(() => setMessage(""));
  };
  return (
    <Box
      paddingBottom={2}
      sx={{
        display: "flex",
        flexDirection: "row",
        bgcolor: "background.paper",
      }}
    >
      <TextField
        autoFocus
        margin="dense"
        multiline
        rows={rows}
        id="comment"
        fullWidth
        variant="outlined"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <Box
        padding={1}
        sx={{
          display: "flex",
          flexDirection: "row",
          bgcolor: "background.paper",
        }}
      >
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || !message}
        >
          {loading ? "Loading" : "Post"}
        </Button>
      </Box>
    </Box>
  );
};

export default CommentForm;
