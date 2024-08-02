import { Request as ExpressRequest } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { IUser } from "./User.Interface";

export interface Request<
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = qs.ParsedQs,
  Locals extends Record<string, any> = Record<string, any>
> extends ExpressRequest<P, ResBody, ReqBody, ReqQuery, Locals> {
  user?: IUser;
}
