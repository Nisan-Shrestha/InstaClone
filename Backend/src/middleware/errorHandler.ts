import { Internal } from "./../error/Internal";
import { NextFunction, Response } from "express";

import { Request } from "../interfaces/Auth.Interface";

import HttpStatusCodes from "http-status-codes";
import { Forbidden } from "../error/Forbidden";
import loggerWithNameSpace from "../utils/logger";
import { Unauthorized } from "../error/Unauthorized";
import { BadRequest } from "../error/BadRequest";
import { NotFound } from "../error/NotFound";
import { Conflict } from "../error/Conflict";
import { log } from "node:console";

const logger = loggerWithNameSpace("ErrorHandler");

export function notFoundError(req: Request, res: Response) {
  logger.info("reached here generic");
  return res.status(HttpStatusCodes.NOT_FOUND).json({
    message: "Route or resource Not Found",
  });
}

export function genericErrorHandler(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {

  // logger.info("reached here");
  // logger.error(error);
  if (error.stack) {
    logger.error(error.stack);
  }
  let statusCode: number;
  let errorMsg: string;

  // logger.error("error is:", error);
  switch (true) {
    case error instanceof Unauthorized:
      statusCode = HttpStatusCodes.UNAUTHORIZED;
      errorMsg = error.message;
      break;
    case error instanceof Forbidden:
      statusCode = HttpStatusCodes.FORBIDDEN;
      errorMsg = error.message;
      break;
    case error instanceof BadRequest:
      statusCode = HttpStatusCodes.BAD_REQUEST;
      errorMsg = error.message;
      break;
    case error instanceof NotFound:
      statusCode = HttpStatusCodes.NOT_FOUND;
      errorMsg = error.message;
      break;
    case error instanceof Conflict:
      statusCode = HttpStatusCodes.CONFLICT;
      errorMsg = error.message;
      break;
    default:
      statusCode = HttpStatusCodes.INTERNAL_SERVER_ERROR;
      errorMsg = "Internal Server Error" + error.message;
  }

  return res.status(statusCode).json({
    message: errorMsg,
  });
}
