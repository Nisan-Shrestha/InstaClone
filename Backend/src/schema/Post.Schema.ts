import Joi from "joi";

export const getPostSchema = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "username must be a string okay!",
    "any.required": "username is required",
  }),
}).options({ stripUnknown: true });

export const getTagPostListSchema = Joi.object({
  tag: Joi.string().optional().messages({
    "string.base": "tag must be a string.",
  }),
  page: Joi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      "number.base": "page must be a number.",
      "number.integer": "page must be an integer.",
      "number.min": "page must be greater than or equal to 1.",
      "any.required": "page is required.",
    })
    .default(1),
  size: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .messages({
      "number.base": "size must be a number.",
      "number.integer": "size must be an integer.",
      "number.min": "size must be greater than or equal to 1.",
      "number.max": "size must be less than or equal to 100.",
      "any.required": "size is required.",
    })
    .default(10),
}).options({ stripUnknown: true });

export const getPostListSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .optional()
    .messages({
      "number.base": "page must be a number.",
      "number.integer": "page must be an integer.",
      "number.min": "page must be greater than or equal to 1.",
    })
    .default(1),
  size: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .optional()
    .messages({
      "number.base": "size must be a number.",
      "number.integer": "size must be an integer.",
      "number.min": "size must be greater than or equal to 1.",
      "number.max": "size must be less than or equal to 100.",
    })
    .default(10),
}).options({ stripUnknown: true });

export const updatePostSchema = Joi.object({
  caption: Joi.string().required().messages({
    "string.base": "caption must be a string.",
    "any.required": "caption is required.",
  }),
}).options({ stripUnknown: true });
