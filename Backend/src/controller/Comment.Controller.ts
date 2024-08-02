import { NextFunction, Response } from "express";
import { Request } from "../interfaces/Auth.Interface";
import loggerWithNameSpace from "../utils/logger";
import * as CommentService from "../services/Comment.Services";
import HttpStatusCodes from "http-status-codes";
import { Internal } from "../error/Internal";
import { log } from "console";
import { UUID } from "crypto";

const logger = loggerWithNameSpace("Comment Controller");

export async function getCommentForPost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const PostId = req.params.postId as UUID;
  const filter = req.query;
  const serviceResponse = await CommentService.getParentCommentForPost(
    PostId,
    filter
  );
  if (serviceResponse) {
    logger.info("Request Successfull");
    res.status(HttpStatusCodes.OK).json({
      message: "Request Successfull",
      payload: serviceResponse,
    });
    return;
  }
  logger.error("Some Error Occurred");
  throw new Internal("Some Error Occurred");
}

export async function getChildrenForComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const commentId = req.params.commentId as UUID;
  const filter = req.query;
  const serviceResponse = await CommentService.getChildrenForComment(
    commentId,
    filter
  );
  if (serviceResponse) {
    logger.info("Request Successfull");
    res.status(HttpStatusCodes.OK).json({
      message: "Request Successfull",
      payload: serviceResponse,
    });
    return;
  }
  logger.error("Some Error Occurred");
  throw new Internal("Some Error Occurred");
}

export async function createComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const postId = req.params.postId as UUID;
  const user = req.user;
  const content = req.body.content;
  const parentId = req.body.parentId || null;
  const serviceResponse = await CommentService.createComment(
    postId,
    content,
    user,
    parentId
  );
  if (serviceResponse) {
    logger.info("Request Successfull");
    res.status(HttpStatusCodes.OK).json({
      message: "Request Successfull",
      payload: serviceResponse,
    });
    return;
  }
  logger.error("Some Error Occurred");
  throw new Internal("Some Error Occurred");
}

export async function updateComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const commentId = req.params.commentId as UUID;
  const user = req.user;
  const content = req.body.content;

  const serviceResponse = await CommentService.updateComment(
    commentId,
    content,
    user
  );
  if (serviceResponse) {
    logger.info("Request Successfull");
    res.status(HttpStatusCodes.OK).json({
      message: "Request Successfull",
      payload: serviceResponse,
    });
    return;
  }
  logger.error("Some Error Occurred");
  throw new Internal("Some Error Occurred");
}

export async function deleteComment(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const commentId = req.params.commentId as UUID;
  const userInfo = req.user;
  const serviceResponse = await CommentService.deleteComment(
    commentId,
    userInfo
  );
  if (serviceResponse) {
    logger.info("Request Successfull");
    res.status(HttpStatusCodes.OK).json({
      message: "Request Successfull",
      payload: serviceResponse,
    });
    return;
  }
  logger.error("Some Error Occurred");
  throw new Internal("Some Error Occurred");
}
