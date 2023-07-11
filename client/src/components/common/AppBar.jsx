import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useAuth } from "../../hooks/AuthContext";
import { useUser } from "../../hooks/UserContext";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import MenuIcon from "@mui/icons-material/Menu";
import { useTheme } from "../../hooks/ThemeContext";

const Appbar = ({ handleDrawerOpen, back }) => {
  const { logout, currentUser } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const navigate = useNavigate();
  let location = useLocation();

  return (
    location.pathname !== "/login" &&
    location.pathname !== "/signup" && (
      <AppBar
        position="fixed"
        color="default"
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: "wrap" }}>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={handleDrawerOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          {location.pathname !== "/" && back && (
            <IconButton
              aria-label="Back"
              sx={{ marginRight: "1rem" }}
              onClick={() => {
                navigate(`/`);
              }}
            >
              <ArrowBackIosNewIcon color="primary" />
            </IconButton>
          )}
          <Typography
            variant="h6"
            color="inherit"
            noWrap
            sx={{ marginRight: "auto" }}
          >
            Fluttr
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <div style={{ display: "flex" }}>
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
            <IconButton sx={{ ml: 1 }} onClick={toggleTheme} color="inherit">
              {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
            {currentUser?.handle && (
              <Typography
                variant="subtitle1"
                color="text.primary"
                sx={{ my: 1, mx: 1.5 }}
              >
                @{currentUser && currentUser?.handle}
              </Typography>
            )}
          </div>
          {currentUser ? (
            <Button variant="outlined" sx={{ my: 1, mx: 1.5 }} onClick={logout}>
              Logout
            </Button>
          ) : (
            <Button
              variant="outlined"
              sx={{ my: 1, mx: 1.5 }}
              onClick={() => {
                navigate(`/login`);
              }}
            >
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    )
  );
};

export default Appbar;
