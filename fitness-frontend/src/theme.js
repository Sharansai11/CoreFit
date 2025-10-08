import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  shape: { borderRadius: 14 },
  palette: { primary: { main: "#6750A4" }, secondary: { main: "#00BFA6" }, background: { default: "#f6f7fb" } },
  typography: { fontFamily: "Inter, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif", h5: { fontWeight: 700 } },
  components: { MuiCard: { styleOverrides: { root: { boxShadow: "0 10px 28px rgba(0,0,0,.08)" } } }, MuiButton: { defaultProps: { variant: "contained" } } },
});

export default theme;
