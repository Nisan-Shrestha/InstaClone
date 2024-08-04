import express from "express";

import {
  deleteSelf,
  getAllFilteredUser,
  getLoggedInUserInfo,
  getUserByUsername,
  getUserFollowersList,
  getUserFollowingList,
  getUserLikedPosts,
  getUserPosts,
  getUserSavedPosts,
  updateLoggedInUserInfo,
  updateLoggedInUserPassword,
  updateLoggedInUserUsername,
  updateProfilePic,
  updatePWViaEmail,
} from "../controller/User.Controller";
import { authenticate } from "../middleware/authController";
import multerUploader from "../middleware/multerHandler";
import {
  validateReqBody,
  validateReqParams,
  validateReqQuery,
} from "../middleware/validator";
import {
  getAllUsersSchema,
  resetViaEmailSchema,
  updateLoggedInUserInfoSchema,
  updateLoggedInUserPasswordSchema,
  UsernameSchema,
} from "../schema/User.Schema";
import { requestHandler } from "../utils/reqHandler";

const router = express();
router.get("/me", authenticate, requestHandler([getLoggedInUserInfo]));
router.get(
  "/",
  authenticate,
  validateReqQuery(getAllUsersSchema),
  requestHandler([getAllFilteredUser])
);
router.get("/likedposts", authenticate, requestHandler([getUserLikedPosts]));

router.get("/savedposts", authenticate, requestHandler([getUserSavedPosts]));
router.get(
  "/:username/following",
  authenticate,
  validateReqParams(UsernameSchema),
  requestHandler([getUserFollowingList])
);

router.get(
  "/:username/followers",
  authenticate,
  validateReqParams(UsernameSchema),
  requestHandler([getUserFollowersList])
);

router.get(
  "/:username/posts",
  authenticate,
  validateReqParams(UsernameSchema),
  // validateReqBody(UsernameSchema),
  requestHandler([getUserPosts])
);

router.get(
  "/:username",
  authenticate,
  validateReqParams(UsernameSchema),
  requestHandler([getUserByUsername])
);

router.put(
  "/info",
  authenticate,
  validateReqBody(updateLoggedInUserInfoSchema),
  requestHandler([updateLoggedInUserInfo])
);

router.put(
  "/pw",
  authenticate,
  validateReqBody(updateLoggedInUserPasswordSchema),
  requestHandler([updateLoggedInUserPassword])
);
router.put(
  "/reset-pw-email",

  validateReqBody(resetViaEmailSchema),
  requestHandler([updatePWViaEmail])
);

router.put(
  "/username",
  authenticate,
  validateReqBody(UsernameSchema),
  requestHandler([updateLoggedInUserUsername])
);

router.put(
  "/changePfp",
  authenticate,
  multerUploader.fields([{ name: "photo", maxCount: 1 }]),
  requestHandler([updateProfilePic])
);

router.delete("/", authenticate, requestHandler([deleteSelf]));

export default router;
