import express from "express";
import {
  follow,
  getFilteredHashtags,
  // getFilteredHashtagPosts,
  getFollowRequests,
  likePost,
  manageFollowReq,
  savePost,
  unfollow,
  unlikePost,
  unsavePost,
} from "../controller/Api.Controller";
import { authenticate } from "../middleware/authController";
import { validateReqParams, validateReqQuery } from "../middleware/validator";
import { decisionSchema, getHastagsSchema } from "../schema/Api.Schema";
import { getPostSchema } from "../schema/Post.Schema";
import { UsernameSchema } from "../schema/User.Schema";
import { requestHandler } from "../utils/reqHandler";

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
  "/follow-requests",
  authenticate,
  requestHandler([getFollowRequests])
);
router.put(
  "/follow-requests/:username",
  authenticate,
  validateReqParams(UsernameSchema),
  validateReqQuery(decisionSchema),
  requestHandler([manageFollowReq])
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
