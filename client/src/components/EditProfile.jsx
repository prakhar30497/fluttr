import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import InputAdornment from "@mui/material/InputAdornment";
import { useAuth } from "../hooks/AuthContext";

const EditProfile = (props) => {
  const { open, handleDialogClose, handleDialogSubmit, profile } = props;

  const errors = {
    name: "Input upto 50 characters",
    about: "Input upto 300 characters",
    location: "Input upto 25 characters",
  };

  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [location, setLocation] = useState("");

  const [nameError, setNameError] = useState(false);
  const [aboutError, setAboutError] = useState(false);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    setName(profile.name);
    setAbout(profile.about);
    setLocation(profile.location);
  }, [profile]);

  const handleChange = (e) => {
    setName(e.target.value);
    e.target.value.length > 50 ? setNameError(true) : setNameError(false);
  };
  const handleAboutChange = (e) => {
    setAbout(e.target.value);
    e.target.value.length > 300 ? setAboutError(true) : setAboutError(false);
  };
  const handleLocationChange = (e) => {
    setLocation(e.target.value);
    e.target.value.length > 25
      ? setLocationError(true)
      : setLocationError(false);
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
            error={nameError}
            helperText={nameError && errors.name}
            InputProps={
              nameError && {
                endAdornment: (
                  <InputAdornment position="start">
                    {name.length}/50
                  </InputAdornment>
                ),
              }
            }
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
            error={aboutError}
            helperText={aboutError && errors.about}
            InputProps={
              aboutError && {
                endAdornment: (
                  <InputAdornment position="start">
                    {about.length}/300
                  </InputAdornment>
                ),
              }
            }
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
            onChange={handleLocationChange}
            error={locationError}
            helperText={locationError && errors.location}
            InputProps={
              locationError && {
                endAdornment: (
                  <InputAdornment position="start">
                    {location.length}/25
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
            onClick={(e) => handleDialogSubmit(name, about, location)}
            disabled={!name || nameError || aboutError || locationError}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditProfile;
