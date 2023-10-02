import passport from "passport";
import OpenIDConnectStrategy from "passport-openidconnect";



passport.serializeUser(function (user, done) {
  done(null, user);
});


passport.deserializeUser(function (user, done) {
  done(null, user);
});



function verify(req, issuer, profile, cb) {

  //console.log("ARGS", arguments);
  //console.log("ISSUER", issuer);
  //console.log("PROFILE", profile);
  //console.log("REQ", Object.keys(req));

  // return cb(err);

  const query = req.query;

  let user = {
    id: profile.id
  };

  cb(null, user);
}


import { OPENID_ISSUER, OPENID_AUTHORIZE_URL, OPENID_TOKEN_URL, OPENID_USERINFO_URL, OPENID_CLIENT_ID, OPENID_CLIENT_SECRET } from "../config.mjs";

/*
const OPENID_ISSUER = process.env.OPENID_ISSUER || "";
const OPENID_AUTHORIZE_URL = process.env.OPENID_AUTHORIZE_URL?.substr(0, 1) === "/" ? `${OPENID_ISSUER}${process.env.OPENID_AUTHORIZE_URL}` : process.env.OPENID_AUTHORIZE_URL;
const OPENID_TOKEN_URL = process.env.OPENID_TOKEN_URL?.substr(0, 1) === "/" ? `${OPENID_ISSUER}${process.env.OPENID_TOKEN_URL}` : process.env.OPENID_TOKEN_URL;
const OPENID_USERINFO_URL = process.env.OPENID_USERINFO_URL?.substr(0, 1) === "/" ? `${OPENID_ISSUER}${process.env.OPENID_USERINFO_URL}` : process.env.OPENID_USERINFO_URL;
const OPENID_CLIENT_ID = process.env.OPENID_CLIENT_ID || "";
const OPENID_CLIENT_SECRET = process.env.OPENID_CLIENT_SECRET || "";
//*/

passport.use("openidconnect", new OpenIDConnectStrategy({
  passReqToCallback: true,
  issuer: OPENID_ISSUER,
  authorizationURL: OPENID_AUTHORIZE_URL,
  tokenURL: OPENID_TOKEN_URL,
  userInfoURL: OPENID_USERINFO_URL,
  clientID: OPENID_CLIENT_ID,
  clientSecret: OPENID_CLIENT_SECRET,
  callbackURL: "/auth/callback"
}, verify));


export default passport;
