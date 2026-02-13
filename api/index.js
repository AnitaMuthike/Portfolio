const app = require("../src/app");
const { connectToDatabase } = require("../src/db/connection");

module.exports = async function handler(req, res) {
  const needsDatabase =
    req.method === "POST" && String(req.url || "").startsWith("/contact");

  if (needsDatabase) {
    try {
      await connectToDatabase();
    } catch (error) {
      console.error("Database unavailable for request:", error.message);
      return res
        .status(503)
        .send("Message service is temporarily unavailable. Please try again shortly.");
    }
  }

  return app(req, res);
};
