const nodemailer = require("nodemailer");
const config = require("../config/env");
const { createContactNotificationTemplate } = require("../utils/emailTemplates");

let transporter;

function isContactEmailEnabled() {
  return config.mail.contactEmailEnabled;
}

function sanitizeHeaderValue(value) {
  return String(value || "").replace(/[\r\n]+/g, " ").trim();
}

function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: config.mail.smtpHost,
      port: config.mail.smtpPort,
      secure: config.mail.smtpSecure,
      auth: {
        user: config.mail.smtpUser,
        pass: config.mail.smtpPass,
      },
    });
  }

  return transporter;
}

async function sendContactNotification(contactMessage) {
  if (!isContactEmailEnabled()) {
    return;
  }

  const { subject, text, html } = createContactNotificationTemplate(contactMessage);

  await getTransporter().sendMail({
    from: {
      name: sanitizeHeaderValue(config.mail.contactEmailFromName),
      address: config.mail.contactEmailFrom,
    },
    to: config.mail.contactEmailTo,
    subject: sanitizeHeaderValue(subject),
    replyTo: sanitizeHeaderValue(contactMessage.email),
    text,
    html,
  });
}

module.exports = {
  isContactEmailEnabled,
  sendContactNotification,
};
