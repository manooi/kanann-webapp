export const environment = {
  production: false,
  apiUrl: 'http://localhost:5000',
  // apiUrl: 'https://crispto.com',
  auth: {
    domain: 'dev-020ww034u40dczlv.us.auth0.com',
    clientId: 'UfoO9DJLAk4TlayucvxDVRX6xTLTvCZ9',
    logoutRedirectUri: 'https://dev.xn--42c6ba4gwd.com/login',
    redirectUri: window.location.origin,
    audience: 'kanan_api'
  }
};