const test = require("node:test");
const assert = require("node:assert/strict");

const {
  createContactNotificationTemplate,
} = require("../src/utils/emailTemplates");

test("createContactNotificationTemplate builds styled html and text", () => {
  const payload = {
    _id: "abc123",
    name: "Anita Muthike",
    email: "anita@example.com",
    message: "Hello there\nI need your help",
  };

  const { subject, text, html } = createContactNotificationTemplate(payload);

  assert.match(subject, /New Portfolio Contact/);
  assert.match(text, /Anita Portfolio - New Contact Submission/);
  assert.match(text, /Record ID: abc123/);
  assert.match(text, /Submitted: .*EAT/);
  assert.match(html, /<table role="presentation"/);
  assert.match(html, /New Contact Submission/);
  assert.match(html, /mailto:anita@example.com/);
  assert.match(html, /Hello there<br>I need your help/);
  assert.match(html, /EAT/);
});

test("createContactNotificationTemplate escapes html content", () => {
  const payload = {
    name: "<script>alert(1)</script>",
    email: "anita@example.com",
    message: "<b>bold</b>",
  };

  const { html } = createContactNotificationTemplate(payload);

  assert.doesNotMatch(html, /<script>alert\(1\)<\/script>/);
  assert.match(html, /&lt;script&gt;alert\(1\)&lt;\/script&gt;/);
  assert.match(html, /&lt;b&gt;bold&lt;\/b&gt;/);
});
