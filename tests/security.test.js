const test = require("node:test");
const assert = require("node:assert/strict");

const {
  decodeSignedValue,
  encodeSignedValue,
} = require("../src/utils/security");

const secret = "test-secret-key";

test("signed values decode correctly", () => {
  const signed = encodeSignedValue("contact_success", secret);
  const decoded = decodeSignedValue(signed, secret);

  assert.equal(decoded, "contact_success");
});

test("tampered signed values are rejected", () => {
  const signed = encodeSignedValue("contact_success", secret);
  const tampered = `${signed}x`;

  assert.equal(decodeSignedValue(tampered, secret), null);
});

test("signed values with malformed format are rejected", () => {
  assert.equal(decodeSignedValue("invalid", secret), null);
});
