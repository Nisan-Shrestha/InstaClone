import Joi from "joi";

export const UsernameSchema = Joi.object({
  username: Joi.string().required().messages({
    "string.base": "username must be a string okay!",
    "any.required": "username is required",
  }),
}).options({ stripUnknown: true });

export const getAllUsersSchema = Joi.object({
  q: Joi.string().optional().messages({
    "string.base": "query must be a string okay!",
  }),
  page: Joi.number()
    .optional()
    .messages({
      "string.base": "page must be a number okay!",
    })
    .default(1),
  size: Joi.number()
    .optional()
    .messages({
      "string.base": "size must be a number okay!",
    })
    .default(10),
}).options({ stripUnknown: true });

export const updateLoggedInUserInfoSchema = Joi.object({
  name: Joi.string().optional().messages({
    "string.base": "Name must be a string",
  }),
  privacy: Joi.string().valid("public", "private").optional().messages({
    "string.base": "Privacy must be a string",
    "any.only": "Privacy must be either 'public' or 'private'",
  }),
  bio: Joi.string().allow(null).optional().messages({
    "string.base": "Bio must be a string",
  }),
  phone: Joi.string().allow(null).optional().messages({
    "string.base": "Phone must be a string",
  }),
}).options({ stripUnknown: true });

export const updateLoggedInUserPasswordSchema = Joi.object({
  OldPassword: Joi.string().required().messages({
    "any.required": "Old Password is required",
  }),
  NewPassword: Joi.string()
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
}).options({
  stripUnknown: true,
});

export const deleteUserByIDQuerySchema = Joi.object({
  id: Joi.string().required().messages({
    "string.base": "ID must be a string okay!",
    "any.required": "ID is required",
  }),
}).options({ stripUnknown: true });

export const updateUserByIDBodySchema = Joi.object({
  name: Joi.string().optional().messages({
    "string.base": "ID must be a string okay!",
  }),
  email: Joi.string().optional().email().messages({
    "string.base": "ID must be a string okay!",
  }),
}).options({ stripUnknown: true });

export const createUserSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Email must be a valid email",
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
