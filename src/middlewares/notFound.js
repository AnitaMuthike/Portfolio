function notFound(req, res) {
  return res.status(404).send("Page not found.");
}

module.exports = { notFound };
