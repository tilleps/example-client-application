import { randomBytes } from "crypto";

export const OPENID_CLIENT_ID = process.env.OPENID_CLIENT_ID || "";
export const OPENID_CLIENT_SECRET = process.env.OPENID_CLIENT_SECRET || "";
export const OPENID_ISSUER = process.env.OPENID_ISSUER || "";
export const OPENID_AUTHORIZE_URL = process.env.OPENID_AUTHORIZE_URL?.substr(0, 1) === "/" ? `${OPENID_ISSUER}${process.env.OPENID_AUTHORIZE_URL}` : process.env.OPENID_AUTHORIZE_URL;
export const OPENID_TOKEN_URL = process.env.OPENID_TOKEN_URL?.substr(0, 1) === "/" ? `${OPENID_ISSUER}${process.env.OPENID_TOKEN_URL}` : process.env.OPENID_TOKEN_URL;
export const OPENID_USERINFO_URL = process.env.OPENID_USERINFO_URL?.substr(0, 1) === "/" ? `${OPENID_ISSUER}${process.env.OPENID_USERINFO_URL}` : process.env.OPENID_USERINFO_URL;
export const OPENID_LOGOUT_URL = process.env.OPENID_LOGOUT_URL?.substr(0, 1) === "/" ? `${OPENID_ISSUER}${process.env.OPENID_LOGOUT_URL}` : process.env.OPENID_LOGOUT_URL;

export const SESSION_SECRET = process.env.SESSION_SECRET || randomBytes(16).toString("hex");
