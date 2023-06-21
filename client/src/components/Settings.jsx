import React from "react";
import { useNavigate } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const Settings = () => {
  const navigate = useNavigate();
  return (
    <>
      <Container maxWidth="md" component="main" style={{ marginTop: "100px" }}>
        <Box
          padding={1}
          paddingLeft={0}
          sx={{ display: "flex", alignItems: "center" }}
        >
          <IconButton
            aria-label="Back"
            sx={{ marginRight: "1rem" }}
            onClick={() => {
              navigate(`/`);
            }}
          >
            <ArrowBackIosNewIcon color="primary" />
          </IconButton>
          <Typography variant="h5">Settings</Typography>
        </Box>
      </Container>
    </>
  );
};

export default Settings;
