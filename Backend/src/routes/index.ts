import express from "express";

import authRouter from "./Auth.Route";
import utilsRouter from "./Utils.Route";
import userRouter from "./User.Route";
import apiRouter from "./Api.Route";
import postRouter from "./Post.Route";
import commentRouter from "./Comment.Route";
import { Request } from "../interfaces/Auth.Interface";
const router = express();
// router.use("/auth", authRouter);

router.get("/", (req: Request, res) => {
  console.log(req.cookies);
  res.send("Hello WOrld");
});
router.use("/auth", authRouter);
router.use("/utils", utilsRouter);
router.use("/user", userRouter);
router.use("/api", apiRouter);
router.use("/posts", postRouter);
router.use("/comments", commentRouter);
//
export default router;
