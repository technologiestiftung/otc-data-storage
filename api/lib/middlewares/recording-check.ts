import createError from "http-errors";
import { middlewareFunc } from "../common/types";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
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
