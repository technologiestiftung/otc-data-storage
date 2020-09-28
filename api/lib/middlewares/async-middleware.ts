import { Request, Response, NextFunction } from "express";

/**
 * Taken from https://github.com/tranvansang/middleware-async
 *
 */

export const asyncMiddleware = (
  middleware: (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => Promise<any> | any,
) => (req: Request, res: Response, next: NextFunction) => {
  (async () => {
    let called = false;
    const cb = <T>(...args: ReadonlyArray<T>) => {
      if (called) return;
      called = true;
      next(...args);
    };
    try {
      await middleware(req, res, cb);
    } catch (err) {
      cb(err);
    }
  })();
};
