import { Response, NextFunction } from "express";
import { Request } from "../interfaces/Auth.Interface";
import loggerWithNameSpace from "./logger";

const logger = loggerWithNameSpace("Request Hanlder");

export function requestHandler(callbacks: Function[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    // logger.info(`Request to ${req.url} with method ${req.method}`);
    try {
      for (let i = 0; i < callbacks.length; i++) {
        await callbacks[i](req, res, next);
      }
    } catch (e) {
      // console.log(e);
      next(e);
    }
  };
}
