import { Schema } from "joi";
import express from "express";

import {
  getLoggedInUserInfo,
  createUser,
  deleteSelf,
  getAllFilteredUser,
  getUserByUsername,
  updateLoggedInUserInfo,
  updateLoggedInUserPassword,
  updateLoggedInUserUsername,
  getUserFollowingList,
  getUserFollowersList,
  getUserPosts,
  getUserLikedPosts,
  getUserSavedPosts,
} from "../controller/User.Controller";
import { authenticate } from "../middleware/authController";
import {
  validateReqBody,
  validateReqParams,
  validateReqQuery,
} from "../middleware/validator";
import {
  createUserSchema,
  UsernameSchema,
  updateUserByIDBodySchema,
  updateLoggedInUserInfoSchema,
  getAllUsersSchema,
  updateLoggedInUserPasswordSchema,
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
  validateReqParams(UsernameSchema),
  // validateReqBody(UsernameSchema),
  requestHandler([getUserPosts])
);

router.get(
  "/:username",
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
  "/username",
  authenticate,
  validateReqBody(UsernameSchema),
  requestHandler([updateLoggedInUserUsername])
);

router.delete("/", authenticate, requestHandler([deleteSelf]));

// // // TODO: authenticate routes properly (Out of scope of day2)
// router.put(
//   "/",
//   requestHandler([
//     authenticate,
//     // authorize("isAdmin"),
//     validateReqQuery(DeleteUserByIDQuerySchema),
//     validateReqBody(updateUserByIDBodySchema),
//     updateUser,
//   ])
// );

// router.delete(
//   "/",
//   requestHandler([
//     authenticate,
//     // authorize("isAdmin"),
//     validateReqQuery(DeleteUserByIDQuerySchema),
//     deleteUser,
//   ])
// );
// router.put("/", authenticate, authorize("users.putSelf"), updateUserSelf);

export default router;
