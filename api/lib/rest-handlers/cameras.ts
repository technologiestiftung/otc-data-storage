// import { PrismaClient, Camera } from "@prisma/client";
// const db = new PrismaClient();
// import e from "express";
// import { createResponse } from "../util/create-response";

// export async function getAllCameras(
//   _request: e.Request,
//   response: e.Response,
// ): Promise<void> {
//   const cameras = await db.camera.findMany();
//   const res = createResponse<Camera[]>("success", cameras, "cameras");
//   response.json(res);
// }

// export async function getCameraById(
//   request: e.Request,
//   response: e.Response,
// ): Promise<void> {
//   const res = createResponse<Camera>(
//     "success",
//     response.locals.camera,
//     "camera",
//   );
//   response.json(res);
// }
