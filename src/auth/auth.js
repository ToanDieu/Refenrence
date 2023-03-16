import auth0 from "auth0-js";
import config from "../appConfig";

const webAuth = new auth0.WebAuth({
  domain: "missmp.eu.auth0.com",
  clientID: config.AUTH0_CLIENTID,
  redirectUri: config.AUTH0_REDIRECT,
  audience: config.AUTH0_AUD,
  responseType: "token id_token",
  scope: "openid profile email"
});

export { webAuth };
