import { checkTrajectory } from "./lib/middlewares/trajectory-check";
import { checkDetection } from "./lib/middlewares/detection-check";
import { areaCheck } from "./lib/middlewares/area-check";
import { checkRecording } from "./lib/middlewares/recording-check";
import { checkCamera } from "./lib/middlewares/camera-check";
import { asyncMiddleware } from "./lib/middlewares/async-middleware";
import express, { NextFunction } from "express";
import cors from "cors";
import morgan from "morgan";
// import { APP_SECRET } from "./lib/envs";
import { asyncWrapper } from "./lib/util/async-wrapper";
// import { auth } from "nexus-plugin-jwt-auth";
import createError from "http-errors";
import { createResponse } from "./lib/util/create-response";
// import { prisma } from "nexus-plugin-prisma";
import {
  PrismaClient,
  Camera,
  Recording,
  Trajectory,
  Detection,
  Area,
} from "@prisma/client";
import process from "process";
const server = express();
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(cors());
server.use(morgan("combined"));

const db = new PrismaClient();
// use(
//   prisma({
//     client: { options: { log: ["query"] } },
//     migrations: true,
//     features: { crud: true },
//   }),
// );

// use(
//   auth({
//     appSecret: APP_SECRET,
//     protectedPaths,
//   }),
// );

server.get(
  "/healthcheck",
  asyncWrapper(async (_request, response) => {
    response.json(createResponse("alive"));
  }),
);
server.get(
  "/routes",
  asyncWrapper(async (_request, response) => {
    response.json(
      createResponse(
        "possible routes",
        [
          "cameras/:id/recordings/:id/areas/:id/detections/:id",
          "cameras/:id/recordings/:id/trajectories/:id",
        ],
        "routes",
      ),
    );
  }),
);

server.get(
  "/cameras",
  asyncWrapper(async (_request, response) => {
    const cameras = await db.camera.findMany();
    const result = createResponse<Camera[]>("success", cameras, "cameras");
    response.json(result);
  }),
);

server.get(
  "/cameras/:cameraId([0-9]+)",
  asyncMiddleware(checkCamera),
  asyncWrapper(async (_request, response) => {
    const result = createResponse<Camera>(
      "success",
      response.locals.camera,
      "camera",
    );
    response.json(result);
  }),
);

server.get(
  "/cameras/:cameraId([0-9]+)/recordings",
  asyncMiddleware(checkCamera),
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
server.get(
  "/cameras/:cameraId([0-9]+)/recordings/:recordingId([0-9]+)",
  asyncMiddleware(checkCamera),
  asyncMiddleware(checkRecording),
  asyncWrapper(async (_request, response) => {
    const result = createResponse<Recording>(
      "success",
      response.locals.recording as Recording,
      "recording",
    );
    response.json(result);
  }),
);

server.get(
  "/cameras/:cameraId([0-9]+)/recordings/:recordingId([0-9]+)/trajectories",
  asyncMiddleware(checkCamera),
  asyncMiddleware(checkRecording),
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
server.get(
  "/cameras/:cameraId([0-9]+)/recordings/:recordingId([0-9]+)/trajectories/:trajectoryId([0-9]+)",
  asyncMiddleware(checkCamera),
  asyncMiddleware(checkRecording),
  asyncMiddleware(checkTrajectory),
  asyncWrapper(async (_request, response) => {
    const result = createResponse<Trajectory>(
      "success",
      response.locals.trajectory as Trajectory,
      "trajectory",
    );
    response.json(result);
  }),
);
server.get(
  "/cameras/:cameraId([0-9]+)/recordings/:recordingId([0-9]+)/areas",
  asyncMiddleware(checkCamera),
  asyncMiddleware(checkRecording),
  asyncWrapper(async (_request, response) => {
    const area = await db.area.findMany();
    const result = createResponse<Area[]>("success", area, "areas");
    response.json(result);
  }),
);
server.get(
  "/cameras/:cameraId([0-9]+)/recordings/:recordingId([0-9]+)/areas/:areaId([0-9]+)",
  asyncMiddleware(checkCamera),
  asyncMiddleware(checkRecording),
  asyncMiddleware(areaCheck),
  asyncWrapper(async (_request, response) => {
    const result = createResponse<Area>(
      "success",
      response.locals.area as Area,
      "area",
    );
    response.json(result);
  }),
);
server.get(
  "/cameras/:cameraId([0-9]+)/recordings/:recordingId([0-9]+)/areas/:areaId([0-9]+)/detections",
  asyncMiddleware(checkCamera),
  asyncMiddleware(checkRecording),
  asyncMiddleware(areaCheck),
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

server.get(
  "/cameras/:cameraId([0-9]+)/recordings/:recordingId([0-9]+)/areas/:areaId([0-9]+)/detections/:detectionId([0-9]+)",
  asyncMiddleware(checkCamera),
  asyncMiddleware(checkRecording),
  asyncMiddleware(areaCheck),
  asyncMiddleware(checkDetection),
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

server.use(
  (
    error: Error | createError.HttpError,
    _req: express.Request,
    res: express.Response,
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

export { server };
