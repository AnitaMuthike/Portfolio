const crypto = require("crypto");

function generateRandomToken(byteLength = 32) {
  return crypto.randomBytes(byteLength).toString("hex");
}

function signValue(value, secret) {
  return crypto
    .createHmac("sha256", secret)
    .update(value)
    .digest("base64url");
}

function timingSafeEqualText(a, b) {
  const left = Buffer.from(String(a));
  const right = Buffer.from(String(b));

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

function encodeSignedValue(value, secret) {
  const signature = signValue(value, secret);
  return `${value}.${signature}`;
}

function decodeSignedValue(signedValue, secret) {
  if (typeof signedValue !== "string") {
    return null;
  }

  const separatorIndex = signedValue.lastIndexOf(".");
  if (separatorIndex <= 0) {
    return null;
  }

  const value = signedValue.slice(0, separatorIndex);
  const signature = signedValue.slice(separatorIndex + 1);
  const expected = signValue(value, secret);

  if (!timingSafeEqualText(signature, expected)) {
    return null;
  }

  return value;
}

module.exports = {
  decodeSignedValue,
  encodeSignedValue,
  generateRandomToken,
  timingSafeEqualText,
};
