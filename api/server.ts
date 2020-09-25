import {
  asyncMiddleware,
  cameraCheck,
  counterCheck,
  detectionCheck,
  recordingCheck,
  trajectoryCheck,
} from "./lib/middlewares/index";
import e, { NextFunction } from "express";

import { server, use } from "nexus";

import { APP_SECRET } from "./lib/envs";
import { asyncWrapper } from "./lib/util/async-wrapper";
import { auth } from "nexus-plugin-jwt-auth";
import createError from "http-errors";
import { createResponse } from "./lib/util/create-response";
import { prisma } from "nexus-plugin-prisma";
import { protectedPaths } from "./lib/permissions";
import {
  PrismaClient,
  Camera,
  Recording,
  Trajectory,
  Counter,
  Detection,
} from "@prisma/client";
import process from "process";
const db = new PrismaClient();
use(
  prisma({
    client: { options: { log: ["query"] } },
    migrations: true,
    features: { crud: true },
  }),
);

use(
  auth({
    appSecret: APP_SECRET,
    protectedPaths,
  }),
);

server.express.get(
  "/healthcheck",
  asyncWrapper(async (_request, response) => {
    response.json(createResponse("alive"));
  }),
);
server.express.get(
  "/routes",
  asyncWrapper(async (_request, response) => {
    response.json(
      createResponse(
        "possible routes",
        [
          "cameras/:id/recordings/:id/counter/:id/detections/:id",
          "cameras/:id/recordings/:id/trajectories/:id",
        ],
        "routes",
      ),
    );
  }),
);

server.express.get(
  "/cameras",
  asyncWrapper(async (_request, response) => {
    const cameras = await db.camera.findMany();
    const result = createResponse<Camera[]>("success", cameras, "cameras");
    response.json(result);
  }),
);

server.express.get(
  "/cameras/:cameraId([0-9]+)",
  asyncMiddleware(cameraCheck),
  asyncWrapper(async (_request, response) => {
    const result = createResponse<Camera>(
      "success",
      response.locals.camera,
      "camera",
    );
    response.json(result);
  }),
);

server.express.get(
  "/cameras/:cameraId([0-9]+)/recordings",
  asyncMiddleware(cameraCheck),
  asyncWrapper(async (_request, response) => {
    const recordings = await db.recording.findMany();
    const result = createResponse<Recording[]>(
      "success",
      recordings,
      "cameras",
    );
    response.json(result);
  }),
);
server.express.get(
  "/cameras/:cameraId([0-9]+)/recordings/:recordingId([0-9]+)",
  asyncMiddleware(cameraCheck),
  asyncMiddleware(recordingCheck),
  asyncWrapper(async (_request, response) => {
    const result = createResponse<Recording>(
      "success",
      response.locals.recording as Recording,
      "recording",
    );
    response.json(result);
  }),
);

server.express.get(
  "/cameras/:cameraId([0-9]+)/recordings/:recordingId([0-9]+)/trajectories",
  asyncMiddleware(cameraCheck),
  asyncMiddleware(recordingCheck),
  asyncWrapper(async (_request, response) => {
    const trajectories = await db.trajectory.findMany();
    const result = createResponse<Trajectory[]>(
      "success",
      trajectories,
      "trajectories",
    );
    response.json(result);
  }),
);
server.express.get(
  "/cameras/:cameraId([0-9]+)/recordings/:recordingId([0-9]+)/trajectories/:trajectoryId([0-9]+)",
  asyncMiddleware(cameraCheck),
  asyncMiddleware(recordingCheck),
  asyncMiddleware(trajectoryCheck),
  asyncWrapper(async (_request, response) => {
    const result = createResponse<Trajectory>(
      "success",
      response.locals.trajectory as Trajectory,
      "trajectory",
    );
    response.json(result);
  }),
);
server.express.get(
  "/cameras/:cameraId([0-9]+)/recordings/:recordingId([0-9]+)/counters",
  asyncMiddleware(cameraCheck),
  asyncMiddleware(recordingCheck),
  asyncWrapper(async (_request, response) => {
    const counters = await db.counter.findMany();
    const result = createResponse<Counter[]>("success", counters, "counters");
    response.json(result);
  }),
);
server.express.get(
  "/cameras/:cameraId([0-9]+)/recordings/:recordingId([0-9]+)/counters/:counterId([0-9]+)",
  asyncMiddleware(cameraCheck),
  asyncMiddleware(recordingCheck),
  asyncMiddleware(counterCheck),
  asyncWrapper(async (_request, response) => {
    const result = createResponse<Counter>(
      "success",
      response.locals.counter as Counter,
      "counter",
    );
    response.json(result);
  }),
);
server.express.get(
  "/cameras/:cameraId([0-9]+)/recordings/:recordingId([0-9]+)/counters/:counterId([0-9]+)/detections",
  asyncMiddleware(cameraCheck),
  asyncMiddleware(recordingCheck),
  asyncMiddleware(counterCheck),
  asyncWrapper(async (_request, response) => {
    const detection = await db.detection.findMany();
    const result = createResponse<Detection[]>(
      "success",
      detection,
      "detection",
    );
    response.json(result);
  }),
);

server.express.get(
  "/cameras/:cameraId([0-9]+)/recordings/:recordingId([0-9]+)/counters/:counterId([0-9]+)/detections/:detectionId([0-9]+)",
  asyncMiddleware(cameraCheck),
  asyncMiddleware(recordingCheck),
  asyncMiddleware(counterCheck),
  asyncMiddleware(detectionCheck),
  asyncWrapper(async (_request, response) => {
    const result = createResponse<Detection>(
      "success",
      response.locals.detection as Detection,
      "detection",
    );
    response.json(result);
  }),
);
/**
 * Falltrhough cases
 *
 */
// });

server.express.use(
  (
    error: Error | createError.HttpError,
    _req: e.Request,
    res: e.Response,
    _next: NextFunction,
  ) => {
    let status = 500;
    if (error instanceof createError.HttpError) {
      status = error.status;
    }
    if (process.env.NODE_ENV === "development") {
      console.error("In Error Handler", error);
    }
    // Sends response

    res.status(status).json({
      status,
      message: error.message,
    });
  },
);
