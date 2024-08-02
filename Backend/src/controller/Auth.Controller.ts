import { NextFunction, Response } from "express";
import { Request } from "../interfaces/Auth.Interface";

import { sign, verify } from "jsonwebtoken";
import querystring from "querystring";
import config from "../config";
import { Unauthorized } from "../error/Unauthorized";
import { IUser } from "../interfaces/User.Interface";
import * as AuthService from "../services/Auth.Services";

import HttpStatusCodes from "http-status-codes";
import loggerWithNameSpace from "../utils/logger";
import { Internal } from "../error/Internal";
import { getUserByEmail } from "../services/User.Services";
import { NotFound } from "../error/NotFound";

interface LoginInfo extends Pick<IUser, "username" | "password"> {}

const logger = loggerWithNameSpace("AuthController");

export async function login(
  req: Request<any, any, LoginInfo>,
  res: Response,
  next: NextFunction
) {
  logger.info("Attempted login: ");
  const data = req.body;

  const serviceResponse = await AuthService.login(data);
  // return;
  if (serviceResponse) {
    logger.info("Login Successfull");
    cookieSetter(res, serviceResponse)
      .status(HttpStatusCodes.SEE_OTHER)
      .json({
        message: "Success, please redirect to homepage",
        payload: { redirectTo: `/`, serviceResponse },
      });
    return;
  }

  logger.error("Login Failed:");
  throw new Unauthorized("Login Failed");
}

export async function signup(req: Request, res: Response, next: NextFunction) {
  logger.info("Attempted signup: ");
  const data = req.body;

  let serviceResponse = await AuthService.signup(data);

  if (serviceResponse) {
    let message = serviceResponse.redirected
      ? "Logged in Successfully"
      : "Signup Successfull";
    logger.info(message);
    res.cookie("accessToken", serviceResponse.accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: config.jwt.accessTokenExpiryMS,
    });

    // Set refreshToken cookie
    cookieSetter(res, serviceResponse)
      .status(HttpStatusCodes.SEE_OTHER)
      .json({
        message: "Success, please redirect to homepage",
        payload: { redirectTo: `/login`, serviceResponse },
      });

    return;
  }

  logger.error("signup Failed:");
  throw new Unauthorized("signup Failed");
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  logger.info("Called refresh to refresh Token");
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    logger.error("Refresh token not found in authorization header");
    throw new Unauthorized("Refresh token not found in authorization header");
  }

  verify(refreshToken, config.jwt.secret!, (error, data) => {
    if (error) {
      throw new Unauthorized(error.message);
    }

    if (typeof data !== "string" && data) {
      const payload = {
        id: data.id,
        name: data.name,
        username: data.username,
        email: data.email,
        role: data.role,
        pfpUrl: data.pfpUrl,
      };
      const accessToken = sign(payload, config.jwt.secret!);

      logger.info("Token Refresh successfull:");
      cookieSetter(res, {
        accessToken,
        refreshToken,
        username: data.username,
        pfpUrl: data.pfpUrl,
      })
        .status(HttpStatusCodes.ACCEPTED)
        .json({
          accessToken,
          refreshToken,
        });
    }
  });
}

export async function googleLogin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const params = querystring.stringify({
    client_id: config.google.clientId,
    redirect_uri: "http://localhost:8000/auth/login/google/callback",
    response_type: "code",
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}

export async function googleLoginCallback(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const code = req.query.code;

  let serviceResponse = await AuthService.loginWithGoogle(code);

  if (serviceResponse) {
    logger.info("Login Successfull");

    cookieSetter(res, serviceResponse)
      .status(HttpStatusCodes.ACCEPTED)
      .redirect(`${config.frontendUrl}/`);

    return;
  }

  logger.error("Login Failed:");
  throw new Unauthorized("Login Failed");
}

export async function googleSignUp(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const params = querystring.stringify({
    client_id: config.google.clientId,
    redirect_uri: "http://localhost:8000/auth/signup/google/callback",
    response_type: "code",
    scope:
      "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email",
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
}

export async function googleSignUpCallback(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const code = req.query.code;

  let serviceResponse = await AuthService.signupWithGoogle(code);

  if (serviceResponse) {
    let message = serviceResponse.redirected
      ? "Logged in Successfully"
      : "Signup Successfull";
    logger.info(message);

    cookieSetter(res, serviceResponse)
      .status(HttpStatusCodes.ACCEPTED)
      .redirect(`${config.frontendUrl}/`);

    return;
  }

  logger.error("Login Failed:");
  throw new Unauthorized("Login Failed");
}

function cookieSetter(
  res: Response,
  serviceResponse: {
    accessToken: string;
    refreshToken: string;
    username: string;
    pfpUrl: string;
  }
) {
  console.log(serviceResponse.pfpUrl);
  return res
    .cookie("accessToken", serviceResponse.accessToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: config.jwt.accessTokenExpiryMS,
    })
    .cookie("accessTokenValid", true, {
      httpOnly: false,
      maxAge: config.jwt.accessTokenExpiryMS,
    })
    .cookie("username", serviceResponse.username, {
      httpOnly: false,
    })
    .cookie("pfpUrl", serviceResponse.pfpUrl || "empty", {
      httpOnly: false,
    })
    .cookie("refreshToken", serviceResponse.refreshToken, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: config.jwt.refreshTokenExpiryMS,
    })
    .cookie("refreshTokenValid", true, {
      httpOnly: false,
      maxAge: config.jwt.refreshTokenExpiryMS,
    });
}