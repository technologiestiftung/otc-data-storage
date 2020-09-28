import createError from "http-errors";
import { middlewareFunc } from "../common/types";
import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
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
