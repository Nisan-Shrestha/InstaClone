import { NextFunction, Request, Response } from "express";
import { Schema } from "joi";
import { BadRequest } from "../error/BadRequest";
import loggerWithNameSpace from "../utils/logger";

export function validateReqQuery(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query);

    if (error) {
      next(new BadRequest(error.message));
    }
    req.query = value;
    next();
  };
}

export function validateReqBody(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body);

    if (error) {
      next(new BadRequest(error.message));
    }
    req.body = value;
    // loggerWithNameSpace("RequestValidator").info(JSON.stringify(req.body));
    next();
  };
}

export function validateReqParams(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.params);

    if (error) {
      next(new BadRequest(error.message));
    }
    req.params = value;
    next();
  };
}
export function validateReqHeader(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.headers);

    if (error) {
      next(new BadRequest(error.message));
    }
    req.headers = value;
    next();
  };
}
export function validateAuthenticatedUser(schema: Schema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.headers);

    if (error) {
      next(new BadRequest(error.message));
    }
    req.headers = value;
    next();
  };
}
