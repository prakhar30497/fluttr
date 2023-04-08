import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useAuth } from "../../hooks/AuthContext";
import { useUser } from "../../hooks/UserContext";

const Appbar = () => {
  const { logout } = useAuth();
  const { user } = useUser({});

  return (
    <AppBar
      position="static"
      color="default"
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: "wrap" }}>
        <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
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
