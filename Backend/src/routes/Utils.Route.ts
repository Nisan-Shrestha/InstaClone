import express, { NextFunction, Response } from "express";
import { checkFreeUsername } from "../controller/User.Controller";
import { validateReqBody, validateReqQuery } from "../middleware/validator";
import { checkFreeUsernameSchema, resetPWSchema } from "../schema/Utils.Schema";
import { requestHandler } from "../utils/reqHandler";
import { Request } from "../interfaces/Auth.Interface";
import { sendMail } from "../controller/Auth.Controller";

const router = express();

router.get(
  "/checkFreeUsername",
  validateReqQuery(checkFreeUsernameSchema),
  requestHandler([checkFreeUsername])
);

router.post(
  "/resetRequest",
  validateReqBody(resetPWSchema),
  requestHandler([sendMail])
);

export default router;
