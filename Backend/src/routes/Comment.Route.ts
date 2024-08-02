import express from "express";
import {
  validateReqBody,
  validateReqParams,
  validateReqQuery,
} from "../middleware/validator";
import { requestHandler } from "../utils/reqHandler";
import {
  childForCommentSchema,
  commentForPostSchema,
  CommentPagedQuerySchema,
  createCommentSchema,
  editCommentParamSchema,
  updateCommentSchema,
} from "../schema/Comment.Schema";
import {
  createComment,
  deleteComment,
  updateComment,
  getChildrenForComment,
  getCommentForPost,
} from "../controller/Comment.Controller";
import { authenticate } from "../middleware/authController";
import { create } from "domain";

const router = express();

router.get(
  "/allparent/:postId",
  validateReqParams(commentForPostSchema),
  validateReqQuery(CommentPagedQuerySchema),
  requestHandler([getCommentForPost])
);
router.get(
  "/childof/:commentId",
  validateReqParams(childForCommentSchema),
  validateReqQuery(CommentPagedQuerySchema),
  requestHandler([getChildrenForComment])
);
router.post(
  "/:postId",
  authenticate,
  validateReqParams(commentForPostSchema),
  validateReqBody(createCommentSchema),
  requestHandler([createComment])
);
router.put(
  "/:commentId",
  authenticate,
  validateReqParams(editCommentParamSchema),
  validateReqBody(updateCommentSchema),
  requestHandler([updateComment])
);
router.delete("/:postId", authenticate, requestHandler([deleteComment]));

// router.put();

export default router;
