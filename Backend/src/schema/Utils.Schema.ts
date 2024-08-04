import Joi from "joi";

export const checkFreeUsernameSchema = Joi.object({
  username: Joi.string()
    .regex(/^[a-zA-Z0-9.]+$/)
    .required()
    .min(3)
    .lowercase()
    .messages({
      "string.lowercase": "Username must be in lowercase",
      "string.min": "Username must be at least 3 characters long",
      "any.required": "Username is required",
      "string.pattern.base":
        "Username can only contain alphabets, numbers, and periods",
    }),
}).options({ stripUnknown: true });

export const resetPWSchema = Joi.object({
  email: Joi.string().required().messages({
    "string.empty": "Email is required",
    "string.min": "Email must be at least 8 characters",
  }),
}).options({ stripUnknown: true });
