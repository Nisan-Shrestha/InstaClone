import { NextFunction, Response } from "express";
import { Request } from "../interfaces/Auth.Interface";
import loggerWithNameSpace from "../utils/logger";
import * as UserService from "../services/User.Services";
import * as PostService from "../services/Post.Services";
import HttpStatusCodes from "http-status-codes";
import { Internal } from "../error/Internal";
import { log } from "console";
import { UUID } from "crypto";
import { IGetHashtagFilter } from "../interfaces/Utils.Interface";

const logger = loggerWithNameSpace("ApiControllers");

export async function follow(req: Request, res: Response, next: NextFunction) {
  logger.info("Attempted follow: ");
  const requesterID = req.user.id;
  const requestedUsername = req.params.username.toLowerCase();
  const serviceResponse = await UserService.follow(
    requesterID,
    requestedUsername
  );
  if (serviceResponse) {
    logger.info("Follow Successfull");
    res.status(HttpStatusCodes.OK).json({
      message: "Follow Successfull",
      payload: serviceResponse,
    });
    return;
  }
  logger.error("Some Error Occurred");
  throw new Internal("Some Error Occurred");
}
export async function unfollow(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.info("Attempted unfollow: ");
  const requesterID = req.user.id;
  const requestedUsername = req.params.username.toLowerCase();
  const serviceResponse = await UserService.unfollow(
    requesterID,
    requestedUsername
  );
  if (serviceResponse) {
    logger.info("Unfollow Successfull");
    res.status(HttpStatusCodes.OK).json({
      message: "Unfollow Successfull",
      payload: serviceResponse,
    });
    return;
  }
  logger.warn(serviceResponse);
  logger.error("Some Error Occurred");
  throw new Internal("Some Error Occurred");
}
export async function getFollowRequests(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.info("Getting Follow Requests for logged in user: ");
  const requesterID = req.user.id;
  const serviceResponse = await UserService.getFollowRequests(requesterID);
  if (serviceResponse) {
    logger.info("Returning follow requests list,");
    res.status(HttpStatusCodes.OK).json({
      message: "Fetched Follow Requests",
      payload: serviceResponse,
    });
    return;
  }
  logger.error("Some Error Occurred");
  throw new Internal("Some Error Occurred");
}

export async function manageFollowReq(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const followRequestedId = req.user.id; // cuz this
  const followRequesterUsername = req.params.username.toLowerCase();
  const decision = req.query.decision as string;
  console.log(followRequestedId, followRequesterUsername);
  const serviceResponse = await UserService.manageFollowReq(
    followRequesterUsername,
    followRequestedId,
    decision
  );
  if (serviceResponse) {
    logger.info("Returning follow requests list,");
    res.status(HttpStatusCodes.OK).json({
      message: "Fetched Follow Requests",
      payload: serviceResponse,
    });
    return;
  }
  logger.error("Some Error Occurred");
  throw new Internal("Some Error Occurred");
}

export async function likePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.info("Attempted like: ");
  const requesterID = req.user.id;
  const postID = req.params.id as UUID;
  const serviceResponse = await UserService.likePost(requesterID, postID);
  if (serviceResponse) {
    logger.info("Like Successfull");
    res.status(HttpStatusCodes.OK).json({
      message: "Like Successfull",
      payload: serviceResponse,
    });
    return;
  }
  logger.error("Some Error Occurred");
  throw new Internal("Some Error Occurred");
}

export async function unlikePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.info("Attempted like: ");
  const requesterID = req.user.id;
  const postID = req.params.id as UUID;
  const serviceResponse = await UserService.unlikePost(requesterID, postID);
  if (serviceResponse) {
    logger.info("Unlike Successfull");
    res.status(HttpStatusCodes.OK).json({
      message: "Unlike Successfull",
      payload: serviceResponse,
    });
    return;
  }
  logger.error("Some Error Occurred");
  throw new Internal("Some Error Occurred");
}

export async function savePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.info("Attempted like: ");
  const requesterID = req.user.id;
  const postID = req.params.id as UUID;
  const serviceResponse = await UserService.savePost(requesterID, postID);
  if (serviceResponse) {
    logger.info("Save Successfull");
    res.status(HttpStatusCodes.OK).json({
      message: "Save Successfull",
      payload: serviceResponse,
    });
    return;
  }
  logger.error("Some Error Occurred");
  throw new Internal("Some Error Occurred");
}

export async function unsavePost(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.info("Attempted like: ");
  const requesterID = req.user.id;
  const postID = req.params.id as UUID;
  const serviceResponse = await UserService.unsavePost(requesterID, postID);
  if (serviceResponse) {
    logger.info("UnSave Successfull");
    res.status(HttpStatusCodes.OK).json({
      message: "UnSave Successfull",
      payload: serviceResponse,
    });
    return;
  }
  logger.error("Some Error Occurred");
  throw new Internal("Some Error Occurred");
}

export async function getFilteredHashtags(
  req: Request<any, any, any, IGetHashtagFilter>,
  res: Response,
  next: NextFunction
) {
  logger.info("Getting Hashtags: ");
  const filter = req.query as IGetHashtagFilter;
  const serviceResponse = await PostService.getFilteredHashtags(filter);
  if (serviceResponse) {
    logger.info("Returning Hashtags");
    res.status(HttpStatusCodes.OK).json({
      message: "Fetched Hashtags",
      payload: serviceResponse,
    });
    return;
  }
  logger.error("Some Error Occurred");
  throw new Internal("Some Error Occurred");
}
