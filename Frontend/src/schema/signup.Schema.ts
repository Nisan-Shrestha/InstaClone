import Joi from "joi";

export const signupSchema = Joi.object({
  username: Joi.string()
    .required()
    .pattern(/^[a-zA-Z0-9.]+$/)
    .min(4)
    .messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 4 characters",
      "string.pattern.base":
        "Username must only contain alphanumeric characters and periods '.'.",
    }),
  name: Joi.string()
    .required()
    .pattern(/^[a-zA-Z0-9 ]+$/)
    .min(4)
    .messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 4 characters",
      "string.pattern.base":
        "Username must only contain alphanumeric characters and spaces ' '.",
    }),
  email: Joi.string().email({ tlds: false }).required().messages({
    "string.empty": "Email is required",
    "string.email": "Email must be a valid email",
  }),

  password: Joi.string()
    .required()
    .min(8)
    .messages({
      "string.empty": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "password.uppercase":
        "Password must contain at least one uppercase letter",
      "password.lowercase":
        "Password must contain at least one lowercase letter",
      "password.special": "Password must contain at least one special letter",
      "password.number": "Password must contain at least one number",
    })
    .custom((value, helpers) => {
      if (!/[A-Z]/.test(value)) {
        return helpers.error("password.uppercase");
      }
      if (!/[a-z]/.test(value)) {
        return helpers.error("password.lowercase");
      }
      if (!/[0-9]/.test(value)) {
        return helpers.error("password.number");
      }
      if (!/[!@#$%^&*]/.test(value)) {
        return helpers.error("password.special");
      }
      return value;
    }),
});
