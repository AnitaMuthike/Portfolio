const path = require("path");
const dotenv = require("dotenv");

const envFilePath = path.resolve(process.cwd(), ".env.local");
dotenv.config({ path: envFilePath, quiet: true });

const requiredEnvs = ["APP_SECRET", "MONGODB_URI"];

for (const key of requiredEnvs) {
  if (!process.env[key]) {
    throw new Error(`Missing core environment variable: ${key}`);
  }
}

if (process.env.APP_SECRET === "replace-this-with-a-long-random-secret") {
  throw new Error("APP_SECRET cannot use the example placeholder value.");
}

function getPositiveNumber(value, fallback) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return parsed;
}

function getBoolean(value, fallback) {
  if (typeof value !== "string") {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (normalized === "true" || normalized === "1" || normalized === "yes") {
    return true;
  }

  if (normalized === "false" || normalized === "0" || normalized === "no") {
    return false;
  }

  return fallback;
}

const config = {
  app: {
    port: Number(process.env.PORT) || 3000,
    environment: process.env.NODE_ENV || "development",
  },
  database: {
    mongoUri: process.env.MONGODB_URI,
  },
  files: {
    cvFile:
      process.env.CV_FILE ||
      "Anita_Muthike_Professional_CV_Improved_Layout.pdf",
  },
  security: {
    appSecret: process.env.APP_SECRET,
    csrfCookieName: "anita_csrf",
    flashCookieName: "anita_flash",
    contactRateLimitWindowMs: getPositiveNumber(
      process.env.CONTACT_RATE_LIMIT_WINDOW_MS,
      1000 * 60 * 10
    ),
    contactRateLimitMax: getPositiveNumber(process.env.CONTACT_RATE_LIMIT_MAX, 5),
  },
  mail: {
    contactEmailEnabled: getBoolean(process.env.CONTACT_EMAIL_ENABLED, false),
    smtpHost: String(process.env.SMTP_HOST || "").trim(),
    smtpPort: getPositiveNumber(process.env.SMTP_PORT, 587),
    smtpSecure: getBoolean(process.env.SMTP_SECURE, false),
    smtpUser: String(process.env.SMTP_USER || "").trim(),
    smtpPass: String(process.env.SMTP_PASS || "").trim(),
    contactEmailFromName: String(
      process.env.CONTACT_EMAIL_FROM_NAME || "Anita Portfolio"
    ).trim(),
    contactEmailFrom: String(
      process.env.CONTACT_EMAIL_FROM || process.env.SMTP_USER || ""
    ).trim(),
    contactEmailTo: String(process.env.CONTACT_EMAIL_TO || "").trim(),
  },
};

if (config.mail.contactEmailEnabled) {
  const requiredMailConfig = [
    ["SMTP_HOST", config.mail.smtpHost],
    ["SMTP_USER", config.mail.smtpUser],
    ["SMTP_PASS", config.mail.smtpPass],
    ["CONTACT_EMAIL_FROM", config.mail.contactEmailFrom],
    ["CONTACT_EMAIL_TO", config.mail.contactEmailTo],
  ];

  for (const [key, value] of requiredMailConfig) {
    if (!value) {
      throw new Error(`Missing email configuration value: ${key}`);
    }
  }
}

module.exports = Object.freeze(config);
