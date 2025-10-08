import { Box, Button, AppBar, Toolbar, Typography, Container, Paper } from "@mui/material";
import { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AuthContext } from "react-oauth2-code-pkce";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { setCredentials, logout as logoutAction } from "./store/authSlice";
import ActivityForm from "./components/ActivityForm";
import ActivityList from "./components/ActivityList";
import ActivityDetail from "./components/ActivityDetail";

const ActivitiesPage = () => (
  <Box sx={{ display: "grid", gap: 2 }}>
    <ActivityForm onActivityAdded={() => window.location.reload()} />
    <Paper sx={{ p: 2, border: "1px solid #eee", background: "linear-gradient(180deg,#fff,#fafbff)" }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1.5 }}>Recent Activities</Typography>
      <ActivityList />
    </Paper>
  </Box>
);

export default function App() {
  const { token, tokenData, logIn, logOut } = useContext(AuthContext);
  const dispatch = useDispatch();

  // mirror provider token into redux/localStorage
  useEffect(() => {
    if (token) dispatch(setCredentials({ token, user: tokenData }));
  }, [token, tokenData, dispatch]);

  const isAuthed = !!(useSelector(s => s.auth.token) || token || localStorage.getItem("token"));
  const user = useSelector(s => s.auth.user);
  const name =
    [user?.given_name, user?.family_name].filter(Boolean).join(" ") ||
    user?.name || user?.preferred_username || user?.email || "";

  // 👇 force Keycloak to show the login screen every time
  const handleLogin = () => logIn({ extraParams: { prompt: "login" } });

  const handleLogout = () => {
    // clear your app state/localStorage
    dispatch(logoutAction());
    // clear tokens managed by react-oauth2-code-pkce (ROCP_* keys)
    logOut();
  };

  return (
    <Router>
      <AppBar position="sticky" color="inherit" elevation={0} sx={{ borderBottom: "1px solid #eee" }}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: .3 }}>FitTrack</Typography>
          <Box sx={{ flexGrow: 1 }} />
          {!isAuthed ? (
            <Button variant="contained" onClick={handleLogin}>Login</Button>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
              {name && <Typography variant="body2" sx={{ fontWeight: 600 }}>{name}</Typography>}
              <Button variant="outlined" onClick={handleLogout}>Logout</Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3 }}>
        {!isAuthed ? (
          <Box sx={{ textAlign: "center", py: 12, color: "text.secondary" }}>
            <Box sx={{ fontSize: 42, fontWeight: 800, mb: 1 }}>Welcome to FitTrack</Box>
            <Box sx={{ mb: 3 }}>Track workouts, see insights, and stay consistent.</Box>
            <Button onClick={handleLogin} sx={{ px: 3, py: 1.2, borderRadius: 2 }}>
              Login
            </Button>
          </Box>
        ) : (
          <Routes>
            <Route path="/" element={<Navigate to="/activities" replace />} />
            <Route path="/activities" element={<ActivitiesPage />} />
            <Route path="/activities/:id" element={<ActivityDetail />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        )}
      </Container>
    </Router>
  );
}
