import createError from "http-errors";
import { middlewareFunc } from "../common/types";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
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
