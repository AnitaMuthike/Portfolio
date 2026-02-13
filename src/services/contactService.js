const ContactMessage = require("../models/ContactMessage");

async function createContactMessage(payload) {
  return ContactMessage.create(payload);
}

module.exports = {
  createContactMessage,
};
