import createError from "http-errors";
import { middlewareFunc } from "../common/types";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

export const checkCamera: middlewareFunc = async (request, response, next) => {
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
