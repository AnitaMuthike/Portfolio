const { isDatabaseConnected } = require("../db/connection");
const { createContactMessage } = require("../services/contactService");
const { isValidCsrf } = require("../services/csrfService");
const { setFlash } = require("../services/flashService");
const { sendContactNotification } = require("../services/emailService");
const { renderHome } = require("../utils/renderHome");
const { validateContactPayload } = require("../utils/validators");

async function submitContact(req, res) {
  const spamTrapValue = String(req.body.website || "").trim();
  if (spamTrapValue) {
    return res.status(204).end();
  }

  const { formData, errorMessage } = validateContactPayload(req.body);

  if (!isValidCsrf(req)) {
    return renderHome(req, res, {
      statusCode: 403,
      errorMessage: "Security check failed. Refresh the page and submit again.",
      focusContact: true,
      formData,
    });
  }

  if (errorMessage) {
    return renderHome(req, res, {
      statusCode: 400,
      errorMessage,
      focusContact: true,
      formData,
    });
  }

  if (!isDatabaseConnected()) {
    return renderHome(req, res, {
      statusCode: 503,
      errorMessage:
        "Message service is temporarily unavailable. Please try again shortly.",
      focusContact: true,
      formData,
    });
  }

  try {
    const savedMessage = await createContactMessage(formData);

    try {
      await sendContactNotification(savedMessage);
      setFlash(res, "contact_success");
    } catch (error) {
      console.error("Failed to send contact notification email:", error.message);
      setFlash(res, "contact_saved_email_failed");
    }

    return res.redirect("/");
  } catch (error) {
    console.error("Failed to save contact message:", error.message);
    return renderHome(req, res, {
      statusCode: 500,
      errorMessage:
        "Your message could not be sent right now. Please try again later.",
      focusContact: true,
      formData,
    });
  }
}

module.exports = {
  submitContact,
};
