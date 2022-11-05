import { AuthConfig } from 'angular-oauth2-oidc';

export const authCodeFlowConfig: AuthConfig = {
  // Url of the Identity Provider
  issuer: 'https://dev-020ww034u40dczlv.us.auth0.com/',
  // issuer: 'https://idsvr4.azurewebsites.net',

  // URL of the SPA to redirect the user to after login
  redirectUri: window.location.origin + '/home',
  postLogoutRedirectUri: window.location.origin + '/login',

  // The SPA's id. The SPA is registerd with this id at the auth-server
  // clientId: 'server.code',
  // clientId: 'spa',
  clientId: 'UfoO9DJLAk4TlayucvxDVRX6xTLTvCZ9',

  // Just needed if your auth server demands a secret. In general, this
  // is a sign that the auth server is not configured with SPAs in mind
  // and it might not enforce further best practices vital for security
  // such applications.
  // dummyClientSecret: 'secret',

  responseType: 'code',

  // set the scope for the permissions the client should request
  // The first four are defined by OIDC.
  // Important: Request offline_access to get a refresh token
  // The api scope is a usecase specific one
  scope: 'openid profile email',
  // scope: 'openid profile email offline_access api',

  showDebugInformation: true,
  strictDiscoveryDocumentValidation: false,
  oidc: true
};