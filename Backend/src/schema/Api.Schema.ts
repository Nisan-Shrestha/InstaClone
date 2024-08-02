import Joi from "joi";

export const decisionSchema = Joi.object({
  decision: Joi.string().required().valid("Accepted", "Rejected").messages({
    "any.required": "Decision is required",
    "string.base": "Decision invalid",
    "string.empty": "Empty Decision not allowed",
    "any.only": "Decision must be either 'Accepted' or 'Rejected'",
  }),
});

export const getHastagsSchema = Joi.object({
  q: Joi.string().required().messages({
    "string.base": "Query must be a string",
    "string.empty": "Query cannot be empty",
    "any.required": "Query is required",
  }),
  page: Joi.number()
    .optional()
    .messages({
      "number.base": "Page must be a number",
    })
    .default(1),
  size: Joi.number()
    .optional()
    .messages({
      "number.base": "Size must be a number",
    })
    .default(20),
}).options({ stripUnknown: true });
