import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import { store } from "./store/store";

import App from "./App";
import { AuthProvider } from "react-oauth2-code-pkce";
import { authConfig } from "./authConfig";

import { CssBaseline, ThemeProvider } from "@mui/material";
import theme from "./theme";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider authConfig={authConfig}>
      <Provider store={store}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </Provider>
    </AuthProvider>
  </React.StrictMode>
);
