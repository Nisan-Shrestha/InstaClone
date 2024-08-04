import express from "express";
import multer from "multer";
import { uploadStream } from "../utils/cloudinary";
import {
  validateReqBody,
  validateReqParams,
  validateReqQuery,
} from "../middleware/validator";
import {
  getPostListSchema,
  getPostSchema,
  getTagPostListSchema,
  updatePostSchema,
} from "../schema/Post.Schema";
import {
  deletePost,
  getUserPostsPaged,
  getFeedPosts,
  getPostByID,
  getPublicPostsRandom,
  handlePostUpload,
  updatePostCaption,
} from "../controller/Post.Controller";
import { authenticate } from "../middleware/authController";
import multerUploader from "../middleware/multerHandler";
// import upload from 'multer';
import { requestHandler } from "../utils/reqHandler";
const router = express();

// router.get("/explore", validateReqParams(getPostSchema), getPostByID);

router.get(
  "/explore",
  authenticate,
  validateReqQuery(getTagPostListSchema),
  requestHandler([getPublicPostsRandom])
);

router.get(
  "/feed",
  authenticate,
  validateReqQuery(getPostListSchema),
  requestHandler([getFeedPosts])
);

router.get(
  "/",
  authenticate,
  validateReqQuery(getPostListSchema),
  requestHandler([getUserPostsPaged])
);

router.get(
  "/:id",
  authenticate,
  validateReqParams(getPostSchema),
  requestHandler([getPostByID])
);

router.post(
  "/upload",
  authenticate,
  multerUploader.fields([{ name: "photo", maxCount: 5 }]),
  requestHandler([handlePostUpload])
);
router.delete(
  "/:id",
  authenticate,
  validateReqParams(getPostSchema),
  requestHandler([deletePost])
);
router.put(
  "/:id",
  authenticate,
  validateReqParams(getPostSchema),
  validateReqBody(updatePostSchema),
  requestHandler([updatePostCaption])
);

export default router;
