import e, { NextFunction } from "express";
import { getAllCameras, getCameraById } from "./lib/rest-handlers/cameras";
import { server, use } from "nexus";

import { APP_SECRET } from "./lib/envs";
import { asyncWrapper } from "./lib/util/async-wrapper";
import { auth } from "nexus-plugin-jwt-auth";
import createError from "http-errors";
import { createResponse } from "./lib/util/create-response";
import { prisma } from "nexus-plugin-prisma";
import { protectedPaths } from "./lib/permissions";

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
  "/healtcheck",
  asyncWrapper(async (_request, response) => {
    response.json(createResponse("alive"));
  }),
);

server.express.get("/cameras", asyncWrapper(getAllCameras));
server.express.get("/cameras/:cameraId([0-9]+)", asyncWrapper(getCameraById));

/**
 * Falltrhough cases
 *
 */
// server.express.use((req, res, next) => {
//   next(createError(404));
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
    console.error(error);
    // Sends response
    res.status(status).json({
      status,
      message: error.message,
      stack: error.stack,
    });
  },
);
