import express from "express";
import config from "../config";
import { sign } from "jsonwebtoken";
import { authenticate } from "../middleware/authController";
import {
  follow,
  getFilteredHashtags,
  // getFilteredHashtagPosts,
  getFollowRequests,
  likePost,
  savePost,
  unfollow,
  unlikePost,
  unsavePost,
} from "../controller/Api.Controller";
import { requestHandler } from "../utils/reqHandler";
import { validateReqParams, validateReqQuery } from "../middleware/validator";
import { UsernameSchema } from "../schema/User.Schema";
import { decisionSchema, getHastagsSchema } from "../schema/Api.Schema";
import { getPostSchema } from "../schema/Post.Schema";

const router = express();

router.post(
  "/follow/:username",
  authenticate,
  validateReqParams(UsernameSchema),
  requestHandler([follow])
);
router.delete(
  "/unfollow/:username",
  authenticate,
  validateReqParams(UsernameSchema),
  requestHandler([unfollow])
);
router.get(
  "/follow-requests/",
  authenticate,
  requestHandler([getFollowRequests])
);
router.put(
  "/follow-requests/:username",
  authenticate,
  validateReqParams(UsernameSchema),
  validateReqQuery(decisionSchema),
  requestHandler([getFollowRequests])
);

router.post(
  "/:id/like",
  authenticate,
  validateReqParams(getPostSchema),
  requestHandler([likePost])
);

router.delete(
  "/:id/unlike",
  authenticate,
  validateReqParams(getPostSchema),
  requestHandler([unlikePost])
);

router.post(
  "/:id/save",
  authenticate,
  validateReqParams(getPostSchema),
  requestHandler([savePost])
);

router.delete(
  "/:id/unsave",
  authenticate,
  validateReqParams(getPostSchema),
  requestHandler([unsavePost])
);

router.get(
  "/hastags",
  authenticate,
  validateReqQuery(getHastagsSchema),
  requestHandler([getFilteredHashtags])
);

// router.put();

export default router;
