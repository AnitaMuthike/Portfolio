function errorHandler(error, req, res, next) {
  console.error("Unhandled error:", error.message);

  if (res.headersSent) {
    return next(error);
  }

  return res.status(500).send("Unexpected server error.");
}

module.exports = { errorHandler };
