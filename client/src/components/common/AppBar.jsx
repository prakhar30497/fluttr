import React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useAuth } from "../../hooks/AuthContext";
import { useUser } from "../../hooks/UserContext";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const Appbar = () => {
  const { logout } = useAuth();
  const { user } = useUser();

  const navigate = useNavigate();

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <IconButton
          aria-label="Back"
          sx={{ marginRight: "1rem" }}
          onClick={() => {
            navigate(`/`);
          }}
        >
          <ArrowBackIosNewIcon color="primary" />
        </IconButton>
        <Typography
          variant="h6"
          color="inherit"
          noWrap
          sx={{ marginRight: "auto" }}
        >
          Fluttr
        </Typography>
        <nav>
          {/* <Link
              variant="button"
              color="text.primary"
              href="#"
              sx={{ my: 1, mx: 1.5 }}
            >
              Features
            </Link>
            <Link
              variant="button"
              color="text.primary"
              href="#"
              sx={{ my: 1, mx: 1.5 }}
            >
              Enterprise
            </Link> */}
          <Typography
            variant="subtitle1"
            color="text.primary"
            sx={{ my: 1, mx: 1.5 }}
          >
            {user?.name}
          </Typography>
        </nav>
        <Button
          href="#"
          variant="outlined"
          sx={{ my: 1, mx: 1.5 }}
          onClick={logout}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Appbar;
