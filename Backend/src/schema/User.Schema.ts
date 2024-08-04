import Joi from "joi";

export const UsernameSchema = Joi.object({
  username: Joi.string().required().lowercase().messages({
    "string.base": "Username must be a string okay!",
    "any.required": "Username is required",
    "string.lowercase": "Username must be in lowercase",
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
  username: Joi.string()
    .regex(/^[a-zA-Z0-9.]+$/)
    .required()
    .min(3)
    .lowercase()
    .messages({
      "string.lowercase": "Username must be in lowercase",
      "any.required": "Username is required",
      "string.pattern.base":
        "Username can only contain alphabets, numbers, and periods",
    }),
  name: Joi.string()
    .required()
    .pattern(/^[a-zA-Z0-Z0-9 ]+$/)
    .min(4)
    .messages({
      "string.empty": "Username is required",
      "string.min": "Username must be at least 4 characters",
      "string.pattern.base":
        "Username must only containric characters and spaces ' '.",
    }),
  privacy: Joi.string().valid("Public", "Private").optional().messages({
    "string.base": "Privacy must be a string",
    "any.only": "Privacy must be either 'Public' or 'Private'",
  }),
  bio: Joi.string().optional().allow("").messages({
    "string.base": "Bio must be a string",
  }),
  phone: Joi.string().optional().allow("").messages({
    "string.base": "Phone must be a string",
  }),
}).options({ stripUnknown: true });

export const resetViaEmailSchema = Joi.object({
  token: Joi.string().required().messages({
    "any.required": "Token is required",
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
}).options({
  stripUnknown: true,
});

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
