import e, { NextFunction } from "express";

// taken from https://zellwk.com/blog/async-await-express/
export function asyncWrapper(
  callback: (
    req: e.Request,
    res: e.Response,
    next: NextFunction,
  ) => Promise<void>,
): (req: e.Request, res: e.Response, next: NextFunction) => void {
  return function (req, res, next): void {
    callback(req, res, next).catch(next);
  };
}
