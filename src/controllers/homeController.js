const fs = require("fs");
const path = require("path");
const config = require("../config/env");
const { renderHome } = require("../utils/renderHome");
const { consumeFlash } = require("../services/flashService");

function getHome(req, res) {
  const flashValue = consumeFlash(req, res);
  const success =
    flashValue === "contact_success" ||
    flashValue === "contact_saved_email_failed";
  const warningMessage =
    flashValue === "contact_saved_email_failed"
      ? "Your message was saved, but email notification is temporarily unavailable."
      : "";

  return renderHome(req, res, { success, warningMessage });
}

function downloadCv(req, res) {
  const cvPath = path.resolve(process.cwd(), config.files.cvFile);

  if (!fs.existsSync(cvPath)) {
    return res.status(404).send("CV PDF not found on server.");
  }

  return res.download(cvPath, "Anita_Muthike_CV.pdf");
}

module.exports = {
  getHome,
  downloadCv,
};
