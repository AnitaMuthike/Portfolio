const { ensureCsrfToken } = require("../services/csrfService");

function renderHome(req, res, options = {}) {
  const {
    statusCode = 200,
    success = false,
    errorMessage = "",
    warningMessage = "",
    formData = { name: "", email: "", message: "" },
  } = options;
  const csrfToken = ensureCsrfToken(req, res);

  return res.status(statusCode).render("index", {
    year: new Date().getFullYear(),
    success,
    errorMessage,
    warningMessage,
    formData,
    csrfToken,
  });
}

module.exports = { renderHome };
