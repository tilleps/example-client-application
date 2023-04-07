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
    id: 1234
  };

  cb(null, user);
}


passport.use("openidconnect", new OpenIDConnectStrategy({
  passReqToCallback: true,
  issuer: "http://localhost:4080/oauth2/v1",
  authorizationURL: "http://localhost:4080/oauth2/v1/authorize",
  tokenURL: "http://localhost:4080/oauth2/v1/token",
  userInfoURL: "http://localhost:4080/oauth2/v1/userinfo",
  clientID: "example_client",
  clientSecret: "example_secret",
  callbackURL: "/auth/callback"
}, verify));


passport.use("openidconnect2", new OpenIDConnectStrategy({
  passReqToCallback: true,
  issuer: "http://localhost:4080/oauth2/v1",
  authorizationURL: "http://localhost:4080/oauth2/v1/authorize",
  tokenURL: "http://localhost:4080/oauth2/v1/token",
  userInfoURL: "http://localhost:4080/oauth2/v1/userinfo",
  clientID: "example_client",
  clientSecret: "example_secret",
  callbackURL: "/auth/callback"
}, verify));



export default passport;
