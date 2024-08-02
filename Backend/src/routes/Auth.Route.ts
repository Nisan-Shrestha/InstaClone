import express from "express";
import config from "../config";
import { sign } from "jsonwebtoken";

const router = express();
import {
  googleLoginCallback,
  googleLogin,
  login,
  refresh,
  googleSignUp,
  googleSignUpCallback,
  signup,
} from "../controller/Auth.Controller";
import { validateReqBody, validateReqHeader } from "../middleware/validator";
import {
  loginSchema,
  refreshSchema,
  signupSchema,
} from "../schema/Auth.Schema";
import { requestHandler } from "../utils/reqHandler";

router.post("/login", validateReqBody(loginSchema), requestHandler([login]));
router.post("/signup", validateReqBody(signupSchema), requestHandler([signup]));
router.get("/refresh", requestHandler([refresh]));

router.get("/login/google", requestHandler([googleLogin]));
router.get("/login/google/callback", requestHandler([googleLoginCallback]));

router.get("/signup/google", requestHandler([googleSignUp]));
router.get("/signup/google/callback", requestHandler([googleSignUpCallback]));

export default router;
