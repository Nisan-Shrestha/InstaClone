import Joi from "joi";

export const loginSchema = Joi.object({
  username: Joi.string().required().min(4).messages({
    "string.empty": "Username is required",
    "string.min": "Username must be at least 4 characters",
  }),
  password: Joi.string().required().min(8).messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 8 characters",
  }),
}).options({ stripUnknown: true });
