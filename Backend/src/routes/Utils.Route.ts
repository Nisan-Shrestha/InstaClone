import express from "express";
import { checkFreeUsername } from "../controller/User.Controller";
import { validateReqQuery } from "../middleware/validator";
import { checkFreeUsernameSchema } from "../schema/Utils.Schema";
import { requestHandler } from "../utils/reqHandler";

const router = express();

router.get(
  "/checkFreeUsername",
  validateReqQuery(checkFreeUsernameSchema),
  requestHandler([checkFreeUsername])
);

export default router;
