import Joi from "joi";

export const commentForPostSchema = Joi.object({
  postId: Joi.string().required().messages({
    "any.required": "postId is required",
    "string.empty": "Empty postId not allowed",
  }),
});

export const editCommentParamSchema = Joi.object({
  commentId: Joi.string().required().messages({
    "any.required": "commentId is required",
    "string.empty": "Empty commentId not allowed",
  }),
});
export const childForCommentSchema = Joi.object({
  commentId: Joi.string().required().messages({
    "any.required": "commentId is required",
    "string.empty": "Empty commentId not allowed",
  }),
});

export const CommentPagedQuerySchema = Joi.object({
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

export const createCommentSchema = Joi.object({
  content: Joi.string().required().min(1).messages({
    "string.base": "content must be a string.",
    "any.required": "content is required.",
    "string.empty": "Empty content not allowed",
  }),
  parentId: Joi.string().optional().messages({
    "string.base": "parentId must be a string.",
    "string.empty": "Empty parentId not allowed",
  }),
}).options({
  stripUnknown: true,
});

export const updateCommentSchema = Joi.object({
  content: Joi.string().required().min(1).messages({
    "string.base": "content must be a string.",
    "any.required": "content is required.",
    "string.empty": "Empty content not allowed",
  }),
}).options({
  stripUnknown: true,
});
