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
  let uid: UUID | null = null;
  const accessToken = req.cookies.accessToken;
  if (accessToken) {
    verify(accessToken, config.jwt.secret!, async (error, data) => {
      uid = data.id as UUID;
    });
  }
  const serviceResponse = await PostService.getPostByID(id as UUID, uid);
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
  const uid = req.user.id;
  const filter = req.query as IGetPostPagedQuery;
  logger.info("Called getAllUserPosts");
  const serviceResponse = await PostService.getUserPostsPaged(
    uid as UUID,
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

  const serviceResponse = await PostService.getPublicPostsRandom(query);
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

// export async function createUser(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const { body } = req;
//   const { user: reqUser } = req;
//   const { email, password, name } = body;
//   logger.info("Called createUser");

//   if (!email || !password || !name) {
//     logger.error("BAD request in createUser");
//     throw new BadRequest("At least one of email, password, name is missing");
//   }

//   const data = await UserService.createUser(body);
//   if (data) {
//     logger.info("User Created");
//     res.status(HttpStatusCodes.ACCEPTED).json(data);
//   }
//   throw Error("Could not create user");
// }

// export async function updateLoggedInUserInfo(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const { id } = req.user;
//   const { body } = req;
//   logger.info("Called updateLoggedInUserInfo");

//   const serviceResponse = await UserService.updateLoggedInUserInfo(
//     id as UUID,
//     body
//   );
//   if (serviceResponse) {
//     res
//       .status(HttpStatusCodes.ACCEPTED)
//       .json({ message: "User Updated", payload: serviceResponse });
//   }

//   throw Error("Could not update User");
// }

// export async function updateLoggedInUserPassword(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const { id } = req.user;
//   const { body } = req;
//   logger.info("Called updateLoggedInUserPassword");

//   const serviceResponse = await UserService.updateLoggedInUserPassword(
//     id as UUID,
//     body
//   );
//   if (serviceResponse) {
//     res
//       .status(HttpStatusCodes.ACCEPTED)
//       .json({ message: "User Updated", payload: serviceResponse });
//   }

//   throw Error("Could not update User");
// }

// export async function updateLoggedInUserUsername(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const { id } = req.user;
//   const { body } = req;
//   logger.info("Called updateLoggedInUserUsername");

//   const serviceResponse = await UserService.updateLoggedInUserUsername(
//     id as UUID,
//     body.username
//   );
//   if (serviceResponse) {
//     res
//       .status(HttpStatusCodes.ACCEPTED)
//       .json({ message: "User Updated", payload: serviceResponse });
//   }

//   throw Error("Could not update User");
// }

// export async function deleteSelf(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   logger.info("Called deleteSelf");
//   const { id } = req.user;

//   const serviceResponse = await UserService.deleteUser(id as UUID);
//   res.status(HttpStatusCodes.SEE_OTHER).json({
//     message: "User Deleted",
//     payload: { ...serviceResponse, redirectTo: `/login` },
//   });
// }

// export async function checkFreeUsername(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const { username } = req.query;
//   logger.info("Called checkFreeUsername for: ", username);

//   if (!username) {
//     logger.warn("Username missing in checkFreeUsername");
//     // throw new BadRequest("Username is required as query param");
//   }

//   const serviceResponse = await UserService.checkFreeUsername(
//     username as string
//   );
//   res
//     .status(HttpStatusCodes.ACCEPTED)
//     .json({ message: "Checking Done", payload: serviceResponse });
// }

// export async function getUserFollowingList(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const { id } = req.user;
//   const { username } = req.params;
//   logger.info("Called getUserFollowingList");

//   const serviceResponse = await UserService.getUserFollowingList(
//     id as UUID,
//     username as string
//   );
//   if (!serviceResponse) {
//     logger.error("Some Error Occurred");
//     throw new NotFound("Some Error Occurred");
//   }
//   res
//     .status(HttpStatusCodes.ACCEPTED)
//     .json({ message: "User Found", payload: serviceResponse });
// }

// export async function getUserFollowersList(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const { id } = req.user;
//   const { username } = req.params;
//   logger.info("Called getUserFollowersList");

//   const serviceResponse = await UserService.getUserFollowersList(
//     id as UUID,
//     username as string
//   );
//   if (!serviceResponse) {
//     logger.error("Some Error Occurred");
//     throw new NotFound("Some Error Occurred");
//   }
//   res
//     .status(HttpStatusCodes.ACCEPTED)
//     .json({ message: "User Found", payload: serviceResponse });
// }

// export async function getUserPosts(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   let requesterUsername = null;
//   let isPublicReq = false;
//   const accessToken = req.cookies.accessToken;
//   if (accessToken) {
//     verify(accessToken, config.jwt.secret!, async (error, data) => {
//       requesterUsername = (await UserService.getUserInfoById(data.id)).username;
//     });
//   } else {
//     isPublicReq = true;
//   }
//   let requestedUsername = req.params.username;

//   logger.info("Called getUserPosts");

//   const serviceResponse = await UserService.getUserPosts(
//     requesterUsername,
//     requestedUsername,
//     isPublicReq
//   );
//   if (!serviceResponse) {
//     logger.error("Some Error Occurred");
//     throw new NotFound("Some Error Occurred");
//   }
//   res
//     .status(HttpStatusCodes.ACCEPTED)
//     .json({ message: "User Found", payload: serviceResponse });
// }
