// authConfig.js
export const authConfig = {
  clientId: "oauth2-pkce-client",
  authorizationEndpoint:
    "http://localhost:8181/realms/fitness-app/protocol/openid-connect/auth",
  tokenEndpoint:
    "http://localhost:8181/realms/fitness-app/protocol/openid-connect/token",
  redirectUri: window.location.origin,
  scope: "openid profile email offline_access",
  // send extra params with the authorize request
  authorizationParams: { prompt: "login" },   // <— add this
  onRefreshTokenExpire: (e) => e.logIn(),
};
