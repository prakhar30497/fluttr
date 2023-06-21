import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useAuth } from "../hooks/AuthContext";

const EditProfile = (props) => {
  const { open, handleDialogClose, handleDialogSubmit, profile } = props;
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    setName(profile.name);
    setAbout(profile.about);
    setLocation(profile.location);
  }, [profile]);

  const handleChange = (e) => {
    setUsername(e.target.value);
  };
  const handleAboutChange = (e) => {
    setAbout(e.target.value);
  };

  return (
    <div>
      <Dialog
        open={open}
        maxWidth="md"
        fullWidth
        onClose={() => handleDialogClose}
      >
        <DialogTitle>Edit Profile</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            multiline
            rows={1}
            id="name"
            fullWidth
            variant="outlined"
            value={name}
            label={"Name"}
            onChange={handleChange}
          />
          <TextField
            margin="dense"
            multiline
            rows={4}
            id="about"
            fullWidth
            variant="outlined"
            value={about}
            label={"About"}
            onChange={handleAboutChange}
          />
          <TextField
            margin="dense"
            multiline
            rows={1}
            id="about"
            fullWidth
            variant="outlined"
            value={location}
            label={"Location"}
            onChange={handleAboutChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={(e) => handleDialogSubmit(about)}
            disabled={!about}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditProfile;
