const config = require("../config/env");
const { parseCookies } = require("../utils/cookies");
const {
  decodeSignedValue,
  encodeSignedValue,
  generateRandomToken,
  timingSafeEqualText,
} = require("../utils/security");

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: config.app.environment === "production",
  path: "/",
  maxAge: 1000 * 60 * 60 * 4,
};

function getCookieCsrfToken(req) {
  const cookies = parseCookies(req.headers.cookie || "");
  const signedValue = cookies[config.security.csrfCookieName];
  return decodeSignedValue(signedValue, config.security.appSecret);
}

function ensureCsrfToken(req, res) {
  const existingToken = getCookieCsrfToken(req);
  if (existingToken) {
    return existingToken;
  }

  const token = generateRandomToken(24);
  const signedToken = encodeSignedValue(token, config.security.appSecret);
  res.cookie(config.security.csrfCookieName, signedToken, cookieOptions);

  return token;
}

function isValidCsrf(req) {
  const cookieToken = getCookieCsrfToken(req);
  const bodyToken = String(req.body._csrf || "");

  if (!cookieToken || !bodyToken) {
    return false;
  }

  return timingSafeEqualText(cookieToken, bodyToken);
}

module.exports = {
  ensureCsrfToken,
  isValidCsrf,
};
