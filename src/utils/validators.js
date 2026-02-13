const Joi = require("joi");

const requiredFieldsMessage = "Please fill in all contact form fields.";
const invalidEmailMessage = "Please provide a valid email address.";

const contactPayloadSchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.base": requiredFieldsMessage,
    "string.empty": requiredFieldsMessage,
    "any.required": requiredFieldsMessage,
  }),
  email: Joi.string().trim().required().email({ tlds: { allow: false } }).messages({
    "string.base": requiredFieldsMessage,
    "string.empty": requiredFieldsMessage,
    "any.required": requiredFieldsMessage,
    "string.email": invalidEmailMessage,
  }),
  message: Joi.string().trim().required().messages({
    "string.base": requiredFieldsMessage,
    "string.empty": requiredFieldsMessage,
    "any.required": requiredFieldsMessage,
  }),
});

function normalizeContactPayload(body = {}) {
  return {
    name: String(body.name || "").trim(),
    email: String(body.email || "").trim(),
    message: String(body.message || "").trim(),
  };
}

function validateContactPayload(body = {}) {
  const normalized = normalizeContactPayload(body);
  const { error, value } = contactPayloadSchema.validate(normalized, {
    abortEarly: true,
    stripUnknown: true,
  });

  if (error) {
    return {
      formData: normalized,
      errorMessage: error.details[0].message,
    };
  }

  return {
    formData: value,
    errorMessage: "",
  };
}

module.exports = {
  normalizeContactPayload,
  validateContactPayload,
};
