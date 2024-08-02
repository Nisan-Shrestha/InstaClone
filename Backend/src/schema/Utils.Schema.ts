import Joi from "joi";

export const checkFreeUsernameSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.base": "username must be a string okay!",
    "any.required": "username is required",
  }),
}).options({ stripUnknown: true });
