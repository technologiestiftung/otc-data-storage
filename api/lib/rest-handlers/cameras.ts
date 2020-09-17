import createError from "http-errors";
import { PrismaClient, Camera } from "@prisma/client";
const db = new PrismaClient();
import e from "express";
import { createResponse } from "../util/create-response";

export async function getAllCameras(
  _request: e.Request,
  response: e.Response,
): Promise<void> {
  const cameras = await db.camera.findMany();
  const res = createResponse<Camera[]>("success", cameras, "cameras");
  response.json(res);
}

export async function getCameraById(
  request: e.Request,
  response: e.Response,
): Promise<void> {
  const { cameraId } = request.params;
  const camera = await db.camera.findOne({
    where: { id: parseInt(cameraId) },
  });
  if (!camera) {
    throw createError(404, "wrong id");
  }
  const res = createResponse<Camera>("success", camera, "camera");
  response.json(res);
}
