import createError from "http-errors";
import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
const db = new PrismaClient();
export type middlewareFunc = (
  request: Request,
  response: Response,
  next: NextFunction,
) => void;

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

export const cameraCheck: middlewareFunc = async (request, response, next) => {
  const id = parseInt(request.params.cameraId);

  const camera = await db.camera.findOne({
    where: { id: id },
  });
  if (!camera) {
    throw createError(404, `camera with id ${id} does not exists`);
  }
  response.locals.camera = camera;
  next();
};

export const recordingCheck: middlewareFunc = async (
  request,
  response,
  next,
) => {
  const id = parseInt(request.params.recordingId);
  const recording = await db.recording.findOne({
    where: { id: id },
  });
  if (!recording) {
    throw createError(404, `recording with id ${id} does not exists`);
  }
  response.locals.recording = recording;
  next();
};

export const counterCheck: middlewareFunc = async (request, response, next) => {
  const id = parseInt(request.params.counterId);
  const counter = await db.counter.findOne({
    where: { id: id },
  });
  if (!counter) {
    throw createError(404, `counter with id ${id} does not exists`);
  }
  response.locals.counter = counter;
  next();
};

export const detectionCheck: middlewareFunc = async (
  request,
  response,
  next,
) => {
  const id = parseInt(request.params.detectionId);
  const detection = await db.detection.findOne({
    where: { id: id },
  });
  if (!detection) {
    throw createError(404, `detection with id ${id} does not exists`);
  }
  response.locals.detection = detection;
  next();
};

export const trajectoryCheck: middlewareFunc = async (
  request,
  response,
  next,
) => {
  const id = parseInt(request.params.trajectoryId);
  const trajectory = await db.trajectory.findOne({
    where: { id: id },
  });
  if (!trajectory) {
    throw createError(404, `trajectory with id ${id} does not exists`);
  }
  response.locals.trajectory = trajectory;
  next();
};
