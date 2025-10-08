import { AppBar, Toolbar, Typography, Button, Avatar, Box } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/authSlice";

const displayName = (u) =>
  [u?.given_name, u?.family_name].filter(Boolean).join(" ")
  || u?.name || u?.preferred_username || u?.email || "User";

const initials = (u) =>
  ((u?.given_name?.[0] || u?.name?.[0] || u?.email?.[0] || "U")
  + (u?.family_name?.[0] || "")).toUpperCase();

export default function TopBar({ onLogin }) {
  const { user, token } = useSelector(s => s.auth);
  const dispatch = useDispatch();

  return (
    <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: "1px solid #eee" }}>
      <Toolbar sx={{ gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: .3 }}>FitTrack</Typography>
        <Box sx={{ flexGrow: 1 }} />
        {!token ? (
          <Button onClick={() => onLogin()}>Login</Button> 
        ) : (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <Avatar sx={{ bgcolor: "primary.main", width: 34, height: 34 }}>
              {initials(user)}
            </Avatar>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {displayName(user)}
            </Typography>
            <Button variant="outlined" onClick={() => dispatch(logout())}>Logout</Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
}
