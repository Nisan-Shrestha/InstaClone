import express from "express";
import {
  googleLogin,
  googleLoginCallback,
  googleSignUp,
  googleSignUpCallback,
  login,
  logout,
  refresh,
  signup,
} from "../controller/Auth.Controller";
import { validateReqBody } from "../middleware/validator";
import { loginSchema, signupSchema } from "../schema/Auth.Schema";
import { requestHandler } from "../utils/reqHandler";

const router = express();

router.post("/login", validateReqBody(loginSchema), requestHandler([login]));
router.get("/logout", requestHandler([logout]));
router.post("/signup", validateReqBody(signupSchema), requestHandler([signup]));
router.get("/refresh", requestHandler([refresh]));

router.get("/login/google", requestHandler([googleLogin]));
router.get("/login/google/callback", requestHandler([googleLoginCallback]));

router.get("/signup/google", requestHandler([googleSignUp]));
router.get("/signup/google/callback", requestHandler([googleSignUpCallback]));

export default router;
