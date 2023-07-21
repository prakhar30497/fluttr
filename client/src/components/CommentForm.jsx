import React, { useState, forwardRef } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import { useAuth } from "../hooks/AuthContext";

const CommentForm = forwardRef(
  ({ rows, loading, error, onSubmit, initialValue = "", ref, placeholder }) => {
    const [message, setMessage] = useState(initialValue);
    const { currentUser } = useAuth();

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
          inputRef={ref}
          id="comment"
          fullWidth
          variant="outlined"
          value={message}
          placeholder={placeholder || "What are your thoughts?"}
          onChange={(e) => setMessage(e.target.value)}
        />
        <Box
          padding={1}
          paddingRight={0}
          sx={{
            display: "flex",
            flexDirection: "row",
            bgcolor: "background.paper",
          }}
        >
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !message || !currentUser}
          >
            {loading ? "Loading" : "Post"}
          </Button>
        </Box>
      </Box>
    );
  }
);

export default CommentForm;
