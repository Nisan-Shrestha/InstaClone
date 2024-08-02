import { hash } from "bcryptjs";
import crypto, { UUID } from "crypto";
import { Internal } from "../error/Internal";
import { NotFound } from "../error/NotFound";
import {
  FollowStatus,
  IUser,
  Privacy,
  Roles,
} from "../interfaces/User.Interface";
import * as UserModel from "../models/User.Model";
import loggerWithNameSpace from "../utils/logger";
// import { UserModel } from "../models/User";
// import { generateUsername } from "unique-username-generator";
import { generateUsername } from "unique-username-generator";
import { alternatives } from "joi";
import bcryptjs from "bcryptjs";
import { Unauthorized } from "../error/Unauthorized";
import { BadRequest } from "../error/BadRequest";
import { IGetUserPagedQuery } from "../interfaces/Utils.Interface";
import * as PostModel from "../models/Post.Model";

const logger = loggerWithNameSpace("UserServices");

interface IUserWithPrompt extends IUser {
  promptUsername?: boolean;
}
export async function getLoggedInUserInfo(id: UUID) {
  logger.info(`Getting user info for id: ${id}`);
  let data = (await UserModel.UserModel.getUserInfoById(id)) as IUserWithPrompt;

  if (!data) {
    logger.error(`User with id: ${id} not found: Model Layer returned Null`);
    throw new NotFound(
      `User with id: ${id} not found: Model Layer returned Null`
    );
  }

  if (data.id === data.username) data = { ...data, promptUsername: true };

  return data;
}

export async function checkFreeUsername(username: string) {
  logger.info(`Checking if username is free: ${username}`);
  const data = await UserModel.UserModel.getUserByUsername(username);
  if (data) {
    logger.info(`Username ${username} is already taken`);

    return { isFree: false, alternatives: await getFreeUsernames(username, 4) };
  }
  logger.info(`Username ${username} is free`);
  return { isFree: true };
}

export async function getFreeUsernames(username: string, count: number) {
  // logger.info(`Checking if username is free: ${username}`);
  let alternatives = [];
  if (!username) {
    username = generateUsername();
    const exists = await UserModel.UserModel.getUserByUsername(username);
    if (!exists) {
      alternatives.push(username);
    }
  }
  while (alternatives.length < count) {
    let name = generateUsername("", 3, username.length + 8, username);
    const exists = await UserModel.UserModel.getUserByUsername(name);
    if (!exists) {
      alternatives.push(name);
    }
  }
  return alternatives;
}

export async function getAllFilteredUser(
  filter: IGetUserPagedQuery,
  requester: Partial<IUser>
) {
  logger.info("Getting all users");
  const data = await UserModel.UserModel.getAllFilteredUser(filter);

  if (!data) {
    logger.error("Could not get users");
    throw new Internal("Could not get users");
  }
  const count = await UserModel.UserModel.count(filter);
  await Promise.all(
    data.map(async (user) => {
      let followStatus = await UserModel.UserModel.getIfAFollowsB(
        requester.id,
        user.id
      );
      let followReqStatus = await UserModel.UserModel.getIfARequestedFollowsB(
        requester.id,
        user.id
      );
      if (followStatus) user.following = FollowStatus.Following;
      else if (followReqStatus) user.following = FollowStatus.Pending;
      else user.following = FollowStatus.Notfollowing;
    })
  );

  const meta = {
    page: filter.page,
    size: data.length,
    total: +count,
  };

  logger.info(`Retrieved ${data.length} users of total ${count}`);
  // return data;
  return { data, meta };
}

export async function createUser(user: IUser) {
  logger.info(`Creating user: ${JSON.stringify(user)}`);
  let hashedPassword = null;
  let randUUID = crypto.randomUUID();
  if (!user.username) user.username = randUUID;
  if (user.password) {
    hashedPassword = await hash(user.password, 10);
  }
  const newUser: Partial<IUser> = {
    id: randUUID,
    name: user.name,
    email: user.email,
    password: hashedPassword,
    role: Roles.Regular,
    username: user.username,
  };
  const createdUser = await UserModel.UserModel.createUser(newUser);
  logger.info(`User created: ${JSON.stringify(createdUser)}`);
  return {
    id: createdUser.id,
    name: createdUser.name,
    username: createdUser.username,
    email: createdUser.email,
    role: createdUser.role,
  };
}

export async function setUserPicture(userId: UUID, PictureLink: string) {
  const updatedUser = await UserModel.UserModel.updateUserPicture(
    userId,
    PictureLink
  );
  return {
    id: updatedUser.id,
    name: updatedUser.name,
    email: updatedUser.email,
    pfpUrl: updatedUser.pfpUrl,
  };
}

export async function updateLoggedInUserInfo(
  id: UUID,
  updateData: Partial<IUser>
) {
  logger.info(`Updating user with id: ${id}`);

  const updatedUser = await UserModel.UserModel.updateLoggedInUserInfo(
    id,
    updateData
  );
  if (!updatedUser) {
    logger.error(`User with id: ${id} not found`);
    throw new NotFound(`User with id: ${id} not found`);
  }
  logger.info(`User updated: ${JSON.stringify(updatedUser)}`);
  return updatedUser;
}

export async function updateLoggedInUserPassword(
  id: UUID,
  updateData: { OldPassword: string; NewPassword: string }
) {
  logger.info(`Attempt Updaaate user pw with id: ${id}`);
  let existingUser = (await UserModel.UserModel.getUserInfoById(id)) as IUser;
  const isValidPassword = await bcryptjs.compare(
    updateData.OldPassword,
    existingUser.password
  );
  if (!isValidPassword) {
    logger.error("Invalid old password received");
    throw new Unauthorized("Invalid old password received");
  }
  const hashedPassword = await hash(updateData.NewPassword, 10);
  const updatedUser = await UserModel.UserModel.updateLoggedInUserPassword(
    id,
    hashedPassword
  );
  if (!updatedUser) {
    logger.error(`User with id: ${id} not found`);
    throw new NotFound(`User with id: ${id} not found`);
  }
  logger.info(`User updated: ${JSON.stringify(updatedUser)}`);
  return updatedUser;
}

export async function updateLoggedInUserUsername(
  id: UUID,
  newUsername: string
) {
  logger.info(`Attempt Update username id: ${id}`);
  let existingUser = (await UserModel.UserModel.getUserInfoById(id)) as IUser;
  let isFree = await checkFreeUsername(newUsername).then((res) => res.isFree);
  let updatedUser;
  if (isFree)
    updatedUser = await UserModel.UserModel.updateLoggedInUserUsername(
      id,
      newUsername
    );
  if (!updatedUser) {
    logger.error(`User with id: ${id} not found`);
    throw new NotFound(`User with id: ${id} not found`);
  }
  return updatedUser;
}

export async function deleteUser(id: UUID) {
  let result = await UserModel.UserModel.deleteUser(id);
  if (!result) {
    throw new NotFound(`User with id: ${id} not found`);
  }
  logger.info(`User with id: ${id} deleted successfully`);
  return result;
}

export async function getUserInfoById(id: UUID) {
  logger.info(`Getting user by ID: ${id}`);
  const data = await UserModel.UserModel.getUserInfoById(id);
  if (data) {
    logger.info(`User found: ${JSON.stringify(data)}`);
    return data;
  }

  logger.warn(`User with ID ${id} not found`);
  return null;
  // throw new Error(`User with email ${email} not found`);
}
export async function getUserByEmail(email: string) {
  logger.info(`Getting user by email: ${email}`);
  const data = await UserModel.UserModel.getUserByEmail(email);
  if (data) {
    logger.info(`User found: ${JSON.stringify(data)}`);
    return data;
  }

  logger.warn(`User with email ${email} not found`);
  return null;
  // throw new Error(`User with email ${email} not found`);
}

export async function getUserByUsername(username: string) {
  logger.info(`Getting user by email: ${username}`);
  const data = await UserModel.UserModel.getUserByUsername(username);
  if (data) {
    console.log("omitted data: ", data);
    return data;
  }

  logger.warn(`User with email ${username} not found`);
  return null;
  // throw new Error(`User with email ${email} not found`);
}

export async function getUserFollowingList(
  requesterID: UUID,
  requestedUsername: string
) {
  const requester = await UserModel.UserModel.getUserInfoById(requesterID);
  const requested = await UserModel.UserModel.getUserByUsername(
    requestedUsername
  );
  if (!requester) {
    throw new NotFound(`User with id: ${requesterID} not found`);
  }
  const requesterFollows = await UserModel.UserModel.getIfAFollowsB(
    requester.id,
    requested.id
  );
  if (
    requester.role == Roles.Admin ||
    requested.privacy == Privacy.Public ||
    requesterFollows
  ) {
    return await UserModel.UserModel.getUserFollowingList(requested.id);
  }

  logger.error(`Some permission error occurred`);
  return null;
}

export async function getUserFollowersList(
  requesterID: UUID,
  requestedUsername: string
) {
  const requester = await UserModel.UserModel.getUserInfoById(requesterID);
  const requested = await UserModel.UserModel.getUserByUsername(
    requestedUsername
  );
  if (!requester) {
    throw new NotFound(`User with id: ${requesterID} not found`);
  }
  const requesterFollows = await UserModel.UserModel.getIfAFollowsB(
    requester.id,
    requested.id
  );
  if (
    requester.role == Roles.Admin ||
    requested.privacy == Privacy.Public ||
    requesterFollows
  ) {
    return await UserModel.UserModel.getUserFollowersList(requested.id);
  }

  logger.error(`Some permission error occurred`);
  return null;
}

export async function getUserPosts(
  requesterUsername: string | null,
  requestedUsername: string,
  isPublicReq: boolean
) {
  let requesterFollows = false;
  let requester = null;
  const requested = await UserModel.UserModel.getUserByUsername(
    requestedUsername
  );
  if (!isPublicReq) {
    requester = await UserModel.UserModel.getUserByUsername(requesterUsername);
    if (!requester) {
      throw new Unauthorized(`Requester User ${requesterUsername} not found`);
    }
    requesterFollows = await UserModel.UserModel.getIfAFollowsB(
      requester.id,
      requested.id
    );
  }

  if (
    isPublicReq ||
    requested.privacy == Privacy.Public ||
    requester.role == Roles.Admin ||
    requesterFollows
  ) {
    // get post list
    let posts = await UserModel.UserModel.getUserPosts(requested.id);
    await Promise.all(
      posts.map(async (post) => {
        post.username = requested.username;
        post.pfpUrl = requested.pfpUrl;
        let mediaInfo = await PostModel.PostModel.getPostMedia(post.id);
        post.mediaUrl = mediaInfo.map((item) => {
          return item.mediaUrl;
        });
      })
    );
    return posts;
    return;
  }

  logger.error(`Some permission error occurred`);
  return null;
}

export async function getUserLikedPosts(id: UUID) {
  let posts = await UserModel.UserModel.getUserLikedPosts(id);
  await Promise.all(
    posts.map(async (post) => {
      let user = await UserModel.UserModel.getUserInfoById(post.userId);
      post.username = user.username;
      post.pfpUrl = user.pfpUrl;
      let mediaInfo = await PostModel.PostModel.getPostMedia(post.id);
      post.mediaUrl = mediaInfo.map((item) => {
        return item.mediaUrl;
      });
    })
  );
  return posts;
}

export async function getUserSavedPosts(id: UUID) {
  let posts = await UserModel.UserModel.getUserSavedPosts(id);
  await Promise.all(
    posts.map(async (post) => {
      let user = await UserModel.UserModel.getUserInfoById(post.userId);
      post.username = user.username;
      post.pfpUrl = user.pfpUrl;
      let mediaInfo = await PostModel.PostModel.getPostMedia(post.id);
      post.mediaUrl = mediaInfo.map((item) => {
        return item.mediaUrl;
      });
    })
  );
  return posts;
}

export async function follow(requesterID: UUID, requestedUsername: string) {
  const requester = await UserModel.UserModel.getUserInfoById(requesterID);
  const requested = await UserModel.UserModel.getUserByUsername(
    requestedUsername
  );
  if (!requester) {
    throw new NotFound(`User with id: ${requesterID} not found`);
  }
  if (!requested) {
    throw new NotFound(`User with username: ${requestedUsername} not found`);
  }
  if (requester.id == requested.id) {
    throw new Unauthorized(`Cannot follow self`);
  }
  const requesterFollows = await UserModel.UserModel.getIfAFollowsB(
    requester.id,
    requested.id
  );
  if (requesterFollows) {
    logger.warn("Already following");
    return { followResult: "followed" };
    // throw new Unauthorized(`Already following`);
  }
  if (requested.privacy == Privacy.Private) {
    let response = await UserModel.UserModel.createFollowRequest(
      requester.id,
      requested.id
    );
    if (response) return { followResult: "requested" };
  } else {
    let response = await UserModel.UserModel.createFollow(
      requester.id,
      requested.id
    );
    if (response) return { followResult: "followed" };
  }
}

export async function unfollow(requesterID: UUID, requestedUsername: string) {
  const requester = await UserModel.UserModel.getUserInfoById(requesterID);
  const requested = await UserModel.UserModel.getUserByUsername(
    requestedUsername
  );
  if (!requester) {
    throw new NotFound(`User with id: ${requesterID} not found`);
  }
  if (!requested) {
    throw new NotFound(`User with username: ${requestedUsername} not found`);
  }
  if (requester.id == requested.id) {
    throw new Unauthorized(`Cannot unfollow self`);
  }
  const requesterFollows = await UserModel.UserModel.getIfAFollowsB(
    requester.id,
    requested.id
  );
  if (requesterFollows) {
    let res = await UserModel.UserModel.deleteFollow(
      requester.id,
      requested.id
    );
    console.log(requester, requested);
    if (res) return { followResult: "unfollowed" };
    else throw new Internal(" Could not unfollow");
  }
  const hasRequestedFollow = await UserModel.UserModel.getIfARequestedFollowsB(
    requester.id,
    requested.id
  );
  if (hasRequestedFollow) {
    let res = await UserModel.UserModel.deleteFollowRequest(
      requester.id,
      requested.id
    );
    if (res) return { followResult: "unfollowed" };
    else throw new Internal(" Could not unfollow");
  }
  logger.info("here");
  throw new BadRequest(`Not following`);
}

export async function getFollowRequests(id: UUID) {
  const data = await UserModel.UserModel.getFollowRequests(id);
  if (!data) {
    throw new NotFound(`User with id: ${id} not found`);
  }
  return data;
}

export async function likePost(requesterId: UUID, pid: UUID) {
  const post = await PostModel.PostModel.getPostByID(pid);
  if (!post) {
    throw new NotFound(`Post with id: ${pid} not found`);
  }
  const like = await UserModel.UserModel.likePost(requesterId, pid);
  if (!like) {
    throw new Internal("Could not like post");
  }
  return { likeResult: "liked" };
}
export async function unlikePost(requesterId: UUID, pid: UUID) {
  const post = await PostModel.PostModel.getPostByID(pid);
  if (!post) {
    throw new NotFound(`Post with id: ${pid} not found`);
  }
  const like = await UserModel.UserModel.unlikePost(requesterId, pid);
  if (!like) {
    throw new Internal("Could not unlike post");
  }
  return { likeResult: "unliked" };
}

export async function savePost(requesterId: UUID, pid: UUID) {
  const post = await PostModel.PostModel.getPostByID(pid);
  if (!post) {
    throw new NotFound(`Post with id: ${pid} not found`);
  }
  const like = await UserModel.UserModel.savePost(requesterId, pid);
  if (!like) {
    throw new Internal("Could not save post");
  }
  return { likeResult: "liked" };
}
export async function unsavePost(requesterId: UUID, pid: UUID) {
  const post = await PostModel.PostModel.getPostByID(pid);
  if (!post) {
    throw new NotFound(`Post with id: ${pid} not found`);
  }
  const like = await UserModel.UserModel.unsavePost(requesterId, pid);
  if (!like) {
    throw new Internal("Could not unsave post");
  }
  return { likeResult: "unliked" };
}
