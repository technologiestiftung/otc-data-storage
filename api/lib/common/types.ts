import { NextFunction, Response, Request } from "express";

export type middlewareFunc = (
  request: Request,
  response: Response,
  next: NextFunction,
) => Promise<void>;
