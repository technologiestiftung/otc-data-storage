import createError from "http-errors";
import { middlewareFunc } from "../common/types";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
export const areaCheck: middlewareFunc = async (request, response, next) => {
  const id = parseInt(request.params.areaId);
  const area = await db.area.findOne({
    where: { id: id },
  });
  if (!area) {
    throw createError(404, `area with id ${id} does not exists`);
  }
  response.locals.area = area;
  next();
};
