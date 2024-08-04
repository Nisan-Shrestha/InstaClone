import { sign } from "jsonwebtoken";
import config from "../config";
import { BadRequest } from "../error/BadRequest";
import { Internal } from "../error/Internal";
import { NotFound } from "../error/NotFound";
import { Unauthorized } from "../error/Unauthorized";
import { IUser } from "../interfaces/User.Interface";
import {
  createUser,
  getUserByEmail,
  getUserByUsername,
  setUserPicture,
} from "./User.Services"; //user.services.ts
import bcryptjs from "bcryptjs";
import loggerWithNameSpace from "../utils/logger";
import { Conflict } from "../error/Conflict";
import { log } from "node:console";
import { create } from "node:domain";
// import sign from "jsonwebtoken";

const logger = loggerWithNameSpace("Auth Services");

export async function login(data: Pick<IUser, "username" | "password">) {
  const existingUser = await getUserByUsername(data.username);

  if (!existingUser) {
    throw new NotFound("User does not exist with given username");
  }
  const isValidPassword = await bcryptjs.compare(
    data.password,
    existingUser.password
  );

  logger.info("comparing");
  if (!isValidPassword) {
    logger.error("Invalid password received");
    throw new Unauthorized("Invalid password received");
  }
  logger.info("compared found");

  const payload = {
    id: existingUser.id,
    name: existingUser.name,
    username: existingUser.username,
    email: existingUser.email,
    role: existingUser.role,
    pfpUrl: existingUser.pfpUrl,
  };

  if (!config.jwt.secret) {
    throw new Internal("Secret not Setup.");
  }

  const accessToken = sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessTokenExpiryMS,
  });

  const refreshToken = sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshTokenExpiryMS,
  });
  return {
    accessToken,
    refreshToken,
    username: payload.username,
    pfpUrl: payload.pfpUrl,
    promptUsernameChange: existingUser.id == existingUser.username,
  };
}

export async function signup(userInfo) {
  userInfo.username = userInfo.username.toLowerCase();
  userInfo.email = userInfo.email.toLowerCase();
  let existingUser = await getUserByEmail(userInfo.email);
  if (!existingUser) existingUser = await getUserByUsername(userInfo.username);
  if (existingUser) {
    logger.error(
      "User with this email/username already exists, logging in instead"
    );
    throw new Conflict("User with this email already exists");
    return;
  }

  const createdUser = await createUser(userInfo as IUser);
  logger.info(`User created: `, createdUser);

  // await setUserPicture(createdUser.id, userInfo.picture);
  const payload = {
    id: createdUser.id,
    name: createdUser.name,
    username: createdUser.username,
    email: createdUser.email,
    role: createdUser.role,
    pfpUrl: null,
  };

  if (!config.jwt.secret) {
    throw new Internal("Secret not Setup.");
  }

  const accessToken = sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessTokenExpiryMS,
  });

  const refreshToken = sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshTokenExpiryMS,
  });

  return {
    accessToken,
    refreshToken,
    username: payload.username,
    pfpUrl: payload.pfpUrl,
    redirected: false,
    promptUsernameChange: createdUser.id == createdUser.username,
  };
}

export async function loginWithGoogle(code) {
  // console.log(userInfo);
  const OAuthAccessTokenResponse = await fetch(
    "https://oauth2.googleapis.com/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        client_id: config.G_OAuth.clientId,
        client_secret: config.G_OAuth.clientSecret,
        redirect_uri: "http://localhost:8000/auth/login/google/callback",
        grant_type: "authorization_code",
      }),
    }
  );
  const data = await OAuthAccessTokenResponse.json();

  console.log("access token: ", data);
  const { access_token } = data;
  const userInfoResponse = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
  );
  const userInfo = await userInfoResponse.json();
  console.log("User Info: ", userInfo);
  let existingUser = await getUserByEmail(userInfo.email);
  if (!existingUser) {
    return new NotFound("User has not signed up with this gmail.");
  }
  // const existingUser = await getUserByEmail(data.email);
  return { ...googleLoginReturn(existingUser) };
}

export async function signupWithGoogle(code) {
  logger.info("code", code);
  const OAuthAccessTokenResponse = await fetch(
    "https://oauth2.googleapis.com/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        client_id: config.G_OAuth.clientId,
        client_secret: config.G_OAuth.clientSecret,
        redirect_uri: "http://localhost:8000/auth/signup/google/callback",
        grant_type: "authorization_code",
      }),
    }
  );

  const { access_token } = await OAuthAccessTokenResponse.json();
  const userInfoResponse = await fetch(
    `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`
  );

  const userInfo = await userInfoResponse.json();

  let existingUser = await getUserByEmail(userInfo.email);
  if (existingUser) {
    logger.warn("User with this email already exists, logging in instead ");
    return { ...googleLoginReturn(existingUser), redirected: true };
  }

  const user = {
    name: userInfo.name,
    email: userInfo.email,
    password: null,
  };

  const createdUser = await createUser(user as IUser);
  logger.info(`User created: `, createdUser);
  await setUserPicture(createdUser.id, userInfo.picture);
  return {
    ...googleLoginReturn(createdUser as IUser),
    pfpUrl: userInfo.picture,
    redirected: false,
  };
}

export async function resetLinkGenerate(email: string) {
  const user: Partial<IUser> = await getUserByEmail(email);
  if (!user) throw new NotFound("User with this email does not exist");
  if (!config.jwt.secret) {
    throw new Internal("Secret not Setup.");
  }

  let payload;
  let expiry = 30 * 60 * 1000;
  let resetToken = sign({ id: user.id }, config.jwt.secret, {
    expiresIn: expiry.toString(),
  });

  return `${config.frontendUrl}/reset-password/token=${resetToken}`;
}

function googleLoginReturn(user: IUser) {
  const payload = {
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    role: user.role,
    pfpUrl: user.pfpUrl,
  };

  if (!config.jwt.secret) {
    throw new Internal("Secret not Setup.");
  }

  const accessToken = sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.accessTokenExpiryMS,
  });

  const refreshToken = sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.refreshTokenExpiryMS,
  });
  return {
    accessToken,
    refreshToken,
    username: payload.username,
    pfpUrl: payload.pfpUrl,
    promptUsernameChange: user.id == user.username,
  };
}
