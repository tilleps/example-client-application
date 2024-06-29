import passport from "passport";
import OpenIDConnectStrategy from "passport-openidconnect";

import OAuth2Strategy from "passport-oauth2";


import { OPENID_ISSUER, OPENID_AUTHORIZE_URL, OPENID_TOKEN_URL, OPENID_USERINFO_URL, OPENID_CLIENT_ID, OPENID_CLIENT_SECRET } from "../config.mjs";


passport.serializeUser(function (user, done) {
  done(null, user);
});


passport.deserializeUser(function (user, done) {
  done(null, user);
});



function oauth2Verify(req, accessToken, refreshToken, params, profile, cb) {
  const { id_token: idToken } = params;
  
  //console.log("ARGS", arguments);
  //console.log("accessToken", accessToken);
  //console.log("refreshToken", refreshToken);
  //console.log("params", params);
  //console.log("profile", profile);
  //console.log("cb", cb);
  //console.log("ID_TOKEN", idToken);

  const query = req.query;

  let user = {
    id: profile.id,
    id_token: idToken
  };

  cb(null, user);
}


passport.use("oauth2", new OAuth2Strategy({
  passReqToCallback: true,
  authorizationURL: OPENID_AUTHORIZE_URL,
  tokenURL: OPENID_TOKEN_URL,
  clientID: OPENID_CLIENT_ID,
  clientSecret: OPENID_CLIENT_SECRET,
  callbackURL: "/auth/callback/oauth2",
  scope: "openid email",
  state: true,
  pkce: true
}, oauth2Verify));



function openidconnectVerify(req, issuer, profile, context, idToken, cb) {

  //console.log("ARGS", arguments);
  //console.log("ISSUER", issuer);
  //console.log("PROFILE", profile);
  //console.log("ID_TOKEN", idToken);
  //console.log("REQ", Object.keys(req));

  // return cb(err);

  const query = req.query;

  let user = {
    id: profile.id,
    id_token: idToken
  };

  cb(null, user);
}


passport.use("openidconnect", new OpenIDConnectStrategy({
  passReqToCallback: true,
  issuer: OPENID_ISSUER,
  authorizationURL: OPENID_AUTHORIZE_URL,
  tokenURL: OPENID_TOKEN_URL,
  userInfoURL: OPENID_USERINFO_URL,
  clientID: OPENID_CLIENT_ID,
  clientSecret: OPENID_CLIENT_SECRET,
  callbackURL: "/auth/callback/openidconnect",
  scope: "email"
}, openidconnectVerify));


export default passport;
