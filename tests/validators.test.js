const test = require("node:test");
const assert = require("node:assert/strict");

const {
  normalizeContactPayload,
  validateContactPayload,
} = require("../src/utils/validators");

test("normalizeContactPayload trims values", () => {
  const payload = normalizeContactPayload({
    name: "  Anita  ",
    email: "  anita@example.com ",
    message: "  Hi there  ",
  });

  assert.deepEqual(payload, {
    name: "Anita",
    email: "anita@example.com",
    message: "Hi there",
  });
});

test("validateContactPayload accepts valid payloads", () => {
  const { formData, errorMessage } = validateContactPayload({
    name: " Anita ",
    email: " anita@example.com ",
    message: " Hello ",
  });

  assert.equal(errorMessage, "");
  assert.deepEqual(formData, {
    name: "Anita",
    email: "anita@example.com",
    message: "Hello",
  });
});

test("validateContactPayload rejects missing fields", () => {
  const { errorMessage } = validateContactPayload({
    name: "",
    email: "anita@example.com",
    message: "Hi",
  });

  assert.equal(errorMessage, "Please fill in all contact form fields.");
});

test("validateContactPayload rejects invalid emails", () => {
  const { errorMessage } = validateContactPayload({
    name: "Anita",
    email: "invalid-email",
    message: "Hi",
  });

  assert.equal(errorMessage, "Please provide a valid email address.");
});
