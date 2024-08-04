import { UUID } from "crypto";
import { NextFunction, Response } from "express";
import HttpStatusCodes from "http-status-codes";
import { BadRequest } from "../error/BadRequest";
import { NotFound } from "../error/NotFound";
import { Request } from "../interfaces/Auth.Interface";
// import { GetUserQuery } from "../interfaces/User.Interface";
import * as UserService from "../services/User.Services";
import loggerWithNameSpace from "../utils/logger";
import { verify } from "jsonwebtoken";
import config from "../config";
import { IGetUserPagedQuery } from "../interfaces/Utils.Interface";
import { IUser } from "../interfaces/User.Interface";
const logger = loggerWithNameSpace("UserController");

export async function getLoggedInUserInfo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.user;
  logger.info("Called getUserInfo");

  const serviceResponse = await UserService.getLoggedInUserInfo(id as UUID);
  if (!serviceResponse) {
    logger.error("User not found in getUserInfo");
    throw new NotFound("Could not find user with given id");
  }
  res
    .status(HttpStatusCodes.ACCEPTED)
    .json({ message: "User Found", payload: serviceResponse });
}

export async function getUserByUsername(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username } = req.params;
  const user = req.user;
  logger.info("Called getUserByUsername");

  const serviceResponse = await UserService.getUserByUsername(
    username as string,
    user.id
  );
  if (!serviceResponse) {
    logger.error("User not found in getUserInfo");
    throw new NotFound("Could not find user with given id");
  }
  const filteredRes = {
    ...serviceResponse,
    password: undefined,
  };
  res.status(HttpStatusCodes.ACCEPTED).json({
    message: "User Found",
    payload: filteredRes,
  });
}

export async function getAllFilteredUser(
  req: Request<any, any, any, IGetUserPagedQuery>,
  res: Response,
  next: NextFunction
) {
  logger.info("Called getAllUser");
  const { query } = req;
  const requester = req.user;
  const serviceResponse = await UserService.getAllFilteredUser(
    query,
    requester
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

export async function createUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { body } = req;
  const { user: reqUser } = req;
  const { email, password, name } = body;
  logger.info("Called createUser");

  if (!email || !password || !name) {
    logger.error("BAD request in createUser");
    throw new BadRequest("At least one of email, password, name is missing");
  }

  const data = await UserService.createUser(body);
  if (data) {
    logger.info("User Created");
    res.status(HttpStatusCodes.ACCEPTED).json(data);
  }
  throw Error("Could not create user");
}

export async function updateLoggedInUserInfo(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.user;
  const { body } = req;
  logger.info("Called updateLoggedInUserInfo");

  const serviceResponse = await UserService.updateLoggedInUserInfo(
    id as UUID,
    body
  );
  if (serviceResponse) {
    res
      .status(HttpStatusCodes.ACCEPTED)
      .cookie("username", serviceResponse.username, {
        httpOnly: false,
      })
      .json({ message: "User Updated", payload: serviceResponse });
    return;
  }

  throw Error("Could not update User");
}

export async function updateProfilePic(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const imageFiles = req.files as { [key: string]: Express.Multer.File[] };
  console.log("req body", JSON.stringify(req.body));
  let photo: Express.Multer.File = imageFiles.photo[0];

  const { id } = req.user;
  const { body } = req;
  logger.info("Called updateProfilePic");

  const serviceResponse = await UserService.updateProfilePic(photo, id as UUID);
  if (serviceResponse) {
    res
      .status(HttpStatusCodes.ACCEPTED)
      .json({ message: "User Updated", payload: serviceResponse });
  }
  throw Error("Could not update User");
}

export async function updateLoggedInUserPassword(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.user;
  const { body } = req;
  logger.info("Called updateLoggedInUserPassword");

  const serviceResponse = await UserService.updateLoggedInUserPassword(
    id as UUID,
    body
  );
  if (serviceResponse) {
    res
      .status(HttpStatusCodes.ACCEPTED)
      .json({ message: "User Updated", payload: serviceResponse });
  }

  throw Error("Could not update User");
}

export async function updatePWViaEmail(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token = req.body.token;
  const pw = req.body.password;
  console.log(token);
  const serviceResponse = await UserService.updatePWviaEmail(token, pw);
  if (serviceResponse) {
    res
      .status(HttpStatusCodes.ACCEPTED)
      .json({ message: "User Updated", payload: serviceResponse });
  }

  throw Error("Could not update User");
}

export async function updateLoggedInUserUsername(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.user;
  const { body } = req;
  logger.info("Called updateLoggedInUserUsername");

  const serviceResponse = await UserService.updateLoggedInUserUsername(
    id as UUID,
    body.username
  );
  if (serviceResponse) {
    res
      .status(HttpStatusCodes.ACCEPTED)
      .cookie("username", serviceResponse.username, {
        httpOnly: false,
      })
      .cookie("promptUsernameChange", false, { httpOnly: false })
      .json({ message: "User Updated", payload: serviceResponse });
  }

  throw Error("Could not update User");
}

export async function deleteSelf(
  req: Request,
  res: Response,
  next: NextFunction
) {
  logger.info("Called deleteSelf");
  const { id } = req.user;

  const serviceResponse = await UserService.deleteUser(id as UUID);
  res.status(HttpStatusCodes.SEE_OTHER).json({
    message: "User Deleted",
    payload: { ...serviceResponse, redirectTo: `/login` },
  });
}

export async function checkFreeUsername(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { username } = req.query;
  logger.info("Called checkFreeUsername for: ", username);

  if (!username) {
    logger.warn("Username missing in checkFreeUsername");
    // throw new BadRequest("Username is required as query param");
  }

  const serviceResponse = await UserService.checkFreeUsername(
    username as string
  );
  res
    .status(HttpStatusCodes.ACCEPTED)
    .json({ message: "Checking Done", payload: serviceResponse });
}

export async function getUserFollowingList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.user;
  const { username } = req.params;
  logger.info("Called getUserFollowingList");

  const serviceResponse = await UserService.getUserFollowingList(
    id as UUID,
    username as string
  );
  if (!serviceResponse) {
    logger.error("Some Error Occurred");
    throw new NotFound("Some Error Occurred");
  }
  res
    .status(HttpStatusCodes.ACCEPTED)
    .json({ message: "User Found", payload: serviceResponse });
}

export async function getUserFollowersList(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.user;
  const { username } = req.params;
  logger.info("Called getUserFollowersList");

  const serviceResponse = await UserService.getUserFollowersList(
    id as UUID,
    username as string
  );
  if (!serviceResponse) {
    logger.error("Some Error Occurred");
    throw new NotFound("Some Error Occurred");
  }
  res
    .status(HttpStatusCodes.ACCEPTED)
    .json({ message: "User Found", payload: serviceResponse });
}

export async function getUserPosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let requestedUsername = req.params.username;
  let requesterUsername = req.user.username;
  const serviceResponse = await UserService.getUserPosts(
    requesterUsername,
    requestedUsername
  );
  if (!serviceResponse) {
    logger.error("Some Error Occurred");
    throw new NotFound("Some Error Occurred");
  }
  res
    .status(HttpStatusCodes.ACCEPTED)
    .json({ message: "Posts FOund", payload: serviceResponse });
}

export async function getUserLikedPosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let user = req.user;

  const serviceResponse = await UserService.getUserLikedPosts(user.id as UUID);
  if (!serviceResponse) {
    logger.error("Some Error Occurred");
    throw new NotFound("Some Error Occurred");
  }
  res
    .status(HttpStatusCodes.ACCEPTED)
    .json({ message: "User Found", payload: serviceResponse });
}
export async function getUserSavedPosts(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let user = req.user;

  const serviceResponse = await UserService.getUserSavedPosts(user.id as UUID);
  if (!serviceResponse) {
    logger.error("Some Error Occurred");
    throw new NotFound("Some Error Occurred");
  }
  res
    .status(HttpStatusCodes.ACCEPTED)
    .json({ message: "User Found", payload: serviceResponse });
}
