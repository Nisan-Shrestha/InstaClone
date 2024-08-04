import { UUID } from "crypto";
import { NextFunction, Response } from "express";
import HttpStatusCodes from "http-status-codes";
import { verify } from "jsonwebtoken";
import config from "../config";
import { NotFound } from "../error/NotFound";
import { Request } from "../interfaces/Auth.Interface";
import * as PostService from "../services/Post.Services";
import loggerWithNameSpace from "../utils/logger";
import { IGetPostPagedQuery } from "../interfaces/Utils.Interface";
import { IUser } from "../interfaces/User.Interface";
import { uploadStream } from "../utils/cloudinary";
import { IPost } from "../interfaces/Post.interface";
import exp from "constants";
import { log } from "console";
const logger = loggerWithNameSpace("Post Controller");

export async function getPostByID(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.params;
  logger.info("Called getUserByUsername");
  let user = req.user;

  const serviceResponse = await PostService.getPostByID(id as UUID, user.id);
  if (!serviceResponse) {
    logger.error("User not found in getUserInfo");
    throw new NotFound("Could not find user with given id");
  }
  res
    .status(HttpStatusCodes.ACCEPTED)
    .json({ message: "User Found", payload: serviceResponse });
}

export async function getUserPostsPaged(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const requester = req.user;
  const filter = req.query as IGetPostPagedQuery;
  logger.info("Called getAllUserPosts");
  const serviceResponse = await PostService.getUserPostsPaged(
    requester.id as UUID,
    filter
  );
  if (!serviceResponse) {
    logger.error("User not found in getUserInfo");
    throw new NotFound("Could not find user with given id");
  }
  res
    .status(HttpStatusCodes.ACCEPTED)
    .json({ message: "User Found", payload: serviceResponse });
}

export async function getPublicPostsRandom(
  req: Request<any, any, any, IGetPostPagedQuery>,
  res: Response,
  next: NextFunction
) {
  logger.info("Called getPublicPostsRandom");
  const { query } = req;
  const user = req.user;
  const serviceResponse = await PostService.getPublicPostsRandom(
    query,
    user.id
  );
  if (!serviceResponse) {
    logger.warn("Service layer returned null or emtpy");
    throw new NotFound("Could not find users");
  }
  logger.info("200 Response sent from getAllUser");
  res
    .status(HttpStatusCodes.ACCEPTED)
    .json({ message: "User Found", payload: serviceResponse });
}

export async function getFeedPosts(
  req: Request<any, any, any, IGetPostPagedQuery>,
  res: Response,
  next: NextFunction
) {
  logger.info("Called getFeedPosts");
  const filter = req.query;
  const { user } = req;

  const serviceResponse = await PostService.getFeedPosts(filter, user as IUser);
  if (!serviceResponse) {
    logger.warn("Service layer returned null or emtpy");
    throw new NotFound("Could not find users");
  }
  logger.info("200 Response sent from getAllUser");
  res
    .status(HttpStatusCodes.ACCEPTED)
    .json({ message: "User Found", payload: serviceResponse });
}

export async function handlePostUpload(req: Request, res: Response) {
  const imageFiles = req.files as { [key: string]: Express.Multer.File[] };
  console.log("req body", JSON.stringify(req.body));
  let photos: Express.Multer.File[] = imageFiles.photo;
  let requester = req.user;
  let postDetails = req.body as Partial<IPost>;
  const serviceResponse = await PostService.handlePostUpload(
    photos,
    requester,
    postDetails
  );
  logger.info(" handlePostUpload done");
  res
    .status(HttpStatusCodes.ACCEPTED)
    .json({ message: "User Found", payload: serviceResponse });
}

export async function deletePost(req: Request, res: Response) {
  let requester = req.user;
  let postId = req.params.id;
  const serviceResponse = await PostService.deletePost(
    postId as UUID,
    requester.id as UUID
  );

  res
    .status(HttpStatusCodes.ACCEPTED)
    .json({ message: "Request Resolved", payload: serviceResponse });
}
export async function updatePostCaption(req: Request, res: Response) {
  let requester = req.user;
  let postId = req.params.id;
  let caption = req.body.caption;
  const serviceResponse = await PostService.updatePostCaption(
    postId as UUID,
    requester.id as UUID,
    caption as string
  );

  res
    .status(HttpStatusCodes.ACCEPTED)
    .json({ message: "Request Resolved", payload: serviceResponse });
}
