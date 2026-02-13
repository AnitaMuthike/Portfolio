const config = require("../config/env");
const { parseCookies } = require("../utils/cookies");
const { decodeSignedValue, encodeSignedValue } = require("../utils/security");

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: config.app.environment === "production",
  path: "/",
  maxAge: 1000 * 60,
};

function setFlash(res, value) {
  const signedValue = encodeSignedValue(value, config.security.appSecret);
  res.cookie(config.security.flashCookieName, signedValue, cookieOptions);
}

function consumeFlash(req, res) {
  const cookies = parseCookies(req.headers.cookie || "");
  const signedValue = cookies[config.security.flashCookieName];

  if (!signedValue) {
    return null;
  }

  res.clearCookie(config.security.flashCookieName, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.app.environment === "production",
    path: "/",
  });

  return decodeSignedValue(signedValue, config.security.appSecret);
}

module.exports = {
  consumeFlash,
  setFlash,
};
