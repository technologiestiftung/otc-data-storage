import createError from "http-errors";
import { middlewareFunc } from "../common/types";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
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
