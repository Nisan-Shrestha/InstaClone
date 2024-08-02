import Joi from "joi";

export const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    "any.required": "Username is required",
    "string.base": "Username was not a string",
    "string.empty": "Empty Username not allowed",
  }),
  password: Joi.string().required().messages({
    "any.required": "Password is required",
    "string.base": "Password invalid",
    "string.empty": "Empty Password not allowed",
  }),
}).options({ stripUnknown: true });

export const signupSchema = Joi.object({
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
  username: Joi.string()
    .regex(/^[a-zA-Z0-9.]+$/)
    .required()
    .min(3)
    .messages({
      "any.required": "Username is required",
      "string.pattern.base":
        "Username can only contain alphabets, numbers, and periods",
    }),
  email: Joi.string().email().required().messages({
    "string.email": "Email invalid",
    "any.required": "Email is required",
  }),
  password: Joi.string()
    .required()
    .min(8)
    .messages({
      "any.required": "Password is required",
      "string.min": "Password must be at least 8 characters",
      "password.uppercase":
        "Password must contain at least one uppercase letter",
      "password.lowercase":
        "Password must contain at least one lowercase letter",
      "password.special": "Password must contain at least one special letter",
      "password.number": "Password must contain at least one number ",
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
}).options({ stripUnknown: true });

export const refreshSchema = Joi.object({
  authorization: Joi.string().required().messages({
    "any.required": "Authorization token not set",
  }),
}).options({ stripUnknown: true });
