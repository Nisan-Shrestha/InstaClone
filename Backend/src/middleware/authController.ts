import { NextFunction, Response } from "express";
import { Request } from "../interfaces/Auth.Interface";
import { verify } from "jsonwebtoken";
import config from "../config";
import { IUser } from "../interfaces/User.Interface";
import { Unauthorized } from "../error/Unauthorized";

export function authenticate(req: Request, res: Response, next: NextFunction) {
  // console.log(req.cookies);
  const accessToken = req.cookies.accessToken;
  if (!accessToken) {
    throw new Unauthorized("accessToken not found");
    return;
  }

  verify(accessToken, config.jwt.secret!, (error, data) => {
    if (error) {
      throw new Unauthorized(error.message);
    }
    req.user = data as IUser;
  });
  next();
}

export function authorize(acceptableRoles: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user as IUser;
    if (!acceptableRoles.split(",").includes(user.role)) {
      next(new Error("Forbidden"));
    }
  };
}
