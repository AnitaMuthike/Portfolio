const path = require("path");
const express = require("express");

const { getHome, downloadCv } = require("./controllers/homeController");
const { submitContact } = require("./controllers/contactController");
const { contactRateLimit } = require("./middlewares/contactRateLimit");
const { notFound } = require("./middlewares/notFound");
const { errorHandler } = require("./middlewares/errorHandler");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "..", "public")));

app.get("/", getHome);
app.post("/contact", contactRateLimit, submitContact);
app.get("/download-cv", downloadCv);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
