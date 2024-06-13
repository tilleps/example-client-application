
import express from "express";
import passport from "../passport.mjs";



const OPENID_ISSUER = process.env.OPENID_ISSUER || "";
const OPENID_AUTHORIZE_URL = process.env.OPENID_AUTHORIZE_URL?.substr(0, 1) === "/" ? `${OPENID_ISSUER}${process.env.OPENID_AUTHORIZE_URL}` : process.env.OPENID_AUTHORIZE_URL;
const OPENID_TOKEN_URL = process.env.OPENID_TOKEN_URL?.substr(0, 1) === "/" ? `${OPENID_ISSUER}${process.env.OPENID_TOKEN_URL}` : process.env.OPENID_TOKEN_URL;
const OPENID_USERINFO_URL = process.env.OPENID_USERINFO_URL?.substr(0, 1) === "/" ? `${OPENID_ISSUER}${process.env.OPENID_USERINFO_URL}` : process.env.OPENID_USERINFO_URL;
const OPENID_CLIENT_ID = process.env.OPENID_CLIENT_ID || "";
const OPENID_CLIENT_SECRET = process.env.OPENID_CLIENT_SECRET || "";



const router = express.Router({
  strict: true
});


/**
 * Login
 */
router.get("/login", function (req, res, next) {
  // Generate URL

  let output = "";

  let clientId = "example_client";
  let redirectUrl = `${req.protocol}://${req.get("host")}/debug/auth/callback`;

  let state = "RANDOM_STATE";

  let url = new URL(OPENID_AUTHORIZE_URL);

  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", redirectUrl);
  url.searchParams.set("scope", "openid email");
  url.searchParams.set("state", state);

  //output = url;

  output += `<a href="${url.toString()}">${url.toString()}</a>`

  res.send(output);
});


/**
 * Login callback
 */
router.get("/auth/callback",

  //
  //  Make request to token endpoint
  //
  async function (req, res, next) {
    const logger = req.app.get("logger");


    // 1. Check for error

    let { error = "", error_description = "", error_uri = "", state = "" } = req.query;
    
    if (error) {
      let json = {
        query: req.query
      };

      let output = "";

      output += "<pre>";
      output += JSON.stringify(json, null, 2);
      output += "</pre>";
      output += `<a href="/debug/login">login</a>`;

      res.send(output);
      return;
    }
    


    // 1. Get the code
    // 2. Send code, client_id, client_secret to token endpoint
    // 3. Get the tokens
    // 4. Sign in user

    // 1. Get the code
    // 2. Send code, client_id, client_secret to token endpoint

    let url = new URL(OPENID_TOKEN_URL);

    let clientId = OPENID_CLIENT_ID;
    let clientSecret = OPENID_CLIENT_SECRET;
    let redirectUrl = `${req.protocol}://${req.get("host")}/debug/auth/callback`;
    let { code = "" } = req.query;

    let body = {
      grant_type: "authorization_code",
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUrl,
      code: code
    };


    //*
    //
    //  JSON (application/json)
    //
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
    //*/


    /*
    //
    //  Form urlencoded (application/x-www-form-urlencoded)
    //
    let response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams(Object.entries(body)).toString()
    })
    //*/

    let json;

    try {
      let text = await response.text();
      logger?.debug({
        response: text
      });

      json = JSON.parse(text);
    }
    catch (err) {
      logger?.error(err);
      next(new Error("Unexpected response from server"));
      return;
    }


    //return res.json(json);

    let output = "";

    output += "<pre>";
    output += JSON.stringify(json, null, 2);
    output += "</pre>";
    output += `<a href="/debug/login">login</a>`;

    res.send(output);
  },


  // Handle custom error
  function (err, req, res, next) {
    const logger = req.app.get("logger");
    logger?.error(err);

    next(err);
  }
);


export default router;

