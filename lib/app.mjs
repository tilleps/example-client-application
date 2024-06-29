import express from "express";
import "express-async-errors";
import passport from "./passport.mjs";

import session from "express-session";
import cookieParser from "cookie-parser";
import ensureLogin from "./middleware/ensure-login.mjs";
import debugRouter from "./debug/router.mjs";

import packageInfo from "../package.json" assert { type: "json" };

import { OPENID_LOGOUT_URL, SESSION_SECRET } from "../config.mjs";

const app = express();

app.set("trust proxy", true);
app.set("view engine", "ejs");
app.set("views", "lib/views");

app.use(cookieParser());

app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());


/**
 * Log the request
 */
app.use(function (req, res, next) {
  const logger = req.app.get("logger");

  logger?.info({
    url: req.originalUrl
  }, "Request");

  next();
});


app.use(function (req, res, next) {
  res.locals.version = packageInfo.version;
  next();
});


/**
 * Home page
 */
app.get("/", function (req, res, next) {
  res.render("home.ejs", {
    user: req.user
  });
});


/**
 * Account (Protected route / requires login)
 *
 */
// Protected
app.get("/account",
  ensureLogin("/login"),
  function (req, res, next) {
    res.render("account.ejs", {
      user: req.user
    });
  }
);


/**
 * Login
 */
//app.get("/login", passport.authenticate("openidconnect"));
app.get("/login", passport.authenticate("oauth2"));

app.get("/login/oauth2", passport.authenticate("oauth2"));
app.get("/login/openidconnect", passport.authenticate("openidconnect"));



/**
 * Logout
 */
app.get("/logout", async function (req, res, next) {

  const logger = req.logger;
  const returnURL = `${req.protocol}://${req.get("host")}/`;


  const logoutURL = new URL(OPENID_LOGOUT_URL);
  logoutURL.searchParams.set("post_logout_redirect_uri", returnURL);

  const idToken = req.user?.id_token;
  if (idToken) {
    logoutURL.searchParams.set("id_token", idToken);
  }

  //
  //  Log User out
  //
  try {
    await new Promise(function (resolve, reject) {

      req.logOut({ keepSessionInfo: true }, function (err) {
        if (err) {
          return reject(err);
        }

        logger?.info(
          {
            context: {
              returnURL,
              logoutURL: logoutURL.toString()
            }
          },
          "LogoutRoute User logged out"
        );

        resolve();
      });
    });

  } catch (err) {

    return next(err);
  }


  //
  //  Destroy session
  //
  try {
    await new Promise(function (resolve, reject) {
      req.session.destroy(function (err) {
        if (err) {
          return reject(err);
        }
        logger?.trace(
          {
            context: {
              returnURL,
              logoutURL: logoutURL.toString()
            }
          },
          "LogoutRoute User session destroyed"
        );

        resolve();
      });
    });
  } catch (err) {
    return next(err);
  }

  res.redirect(logoutURL.toString());
});

// Handle custom error
function customError(err, req, res, next) {
  next(err);
}

function redirectToReturnTo(req, res, next) {
  // User is now signed in and req.user should be populated

  let returnTo = "/";

  if (req.session.returnTo) {
    returnTo = req.session.returnTo;
    delete req.session.returnTo;
  }

  res.redirect(returnTo);
}


/**
 * Auth callback
 */
app.get("/auth/callback",
  //passport.authenticate(["openidconnect"],
  passport.authenticate(["oauth2"],
    {
      session: true,
      failWithError: true,
      keepSessionInfo: true
    }
  ),

  redirectToReturnTo,
  customError,
);


/**
 * Auth callback
 */
app.get("/auth/callback/oauth2",
  //passport.authenticate(["openidconnect"],
  passport.authenticate(["oauth2"],
    {
      session: true,
      failWithError: true,
      keepSessionInfo: true
    }
  ),

  redirectToReturnTo,
  customError,
);

app.get("/auth/callback/openidconnect",
  passport.authenticate(["openidconnect"],
    {
      session: true,
      failWithError: true,
      keepSessionInfo: true
    }
  ),

  redirectToReturnTo,
  customError,
);


app.use("/debug/", debugRouter);



/**
 * Error Handler
 */
app.use(function (err, req, res, next) {

  const logger = req.app.get("logger");

  logger?.error({
    url: req.originalUrl,
    err: err
  }, "Error");

  res.render("error.ejs", {
    name: err.name,
    message: err.message
  });
});


export default app;
