import { booleanArg } from "@nexus/schema";
// import { objectType, makeSchema } from "@nexus/schema";

import { makeSchema, objectType, intArg } from "@nexus/schema";
import { nexusPrismaPlugin } from "nexus-prisma";
import path from "path";
import { Counter } from "./Counter";
import { Camera } from "./Camera";

const Detection = objectType({
  name: "Detection",
  definition(t) {
    t.model.id();
    t.model.detectedAt();
    t.model.counter();
    t.model.counterId();
    t.model.detectionType();
    t.model.detectionTypeId();
    t.model.accuracy();
    t.model.x();
    t.model.y();
  },
});

const DetectionType = objectType({
  name: "DetectionType",
  definition(t) {
    t.model.id();
    t.model.label();
    t.model.description();
    t.model.detections({ type: "Detection" });
    t.model.trajectories({ type: "Trajectory" });
  },
});

const Weather = objectType({
  name: "Weather",
  definition(t) {
    t.model.id();
    t.model.camera();
    t.model.cameraId();
    t.model.recordedAt();
    t.model.humidity();
    t.model.pressure();
    t.model.cloudCoverage();
    t.model.rain();
    t.model.temperature();
    t.model.wind();
    t.model.windDirection();
  },
});
const Trajectory = objectType({
  name: "Trajectory",
  definition(t) {
    t.model.id();
    t.model.camera();
    t.model.cameraId();
    t.model.trajectory();
    t.model.geom();
    t.model.detectionType();
    t.model.detectionTypeId();
    t.model.start();
    t.model.end();
  },
});

const LightningCondition = objectType({
  name: "LightningCondition",
  definition(t) {
    t.model.id();
    t.model.camera();
    t.model.cameraId();
    t.model.recordedAt();
    t.model.value();
  },
});
const Query = objectType({
  name: "Query",
  definition(t) {
    t.crud.camera({ alias: "cameraById" });
    t.crud.counter({ alias: "counterById" });
    t.crud.detection({ alias: "detectionById" });
    t.crud.detectionType({ alias: "detectionTypeById" });
    t.crud.trajectory({ alias: "trajectoryById" });
    t.crud.weather({ alias: "weatherById" });

    t.list.field("countersByCameraId", {
      type: "Counter",
      description: "Get all counters from a specific camera",
      args: {
        cameraId: intArg({
          nullable: false,
          description: "The id (Int) of the camera",
        }),
      },
      resolve: (_, { cameraId }, ctx) => {
        return ctx.prisma.counter.findMany({
          where: { cameraId: cameraId },
        });
      },
    });

    t.list.field("allWeathers", {
      type: "Weather",
      resolve: (_, args, ctx) => {
        return ctx.prisma.weather.findMany();
      },
    });
    t.list.field("allTrajectories", {
      type: "Trajectory",
      resolve: (_, args, ctx) => {
        return ctx.prisma.trajectory.findMany();
      },
    });
    t.list.field("allDetectionTypes", {
      type: "DetectionType",
      resolve: (_, args, ctx) => {
        return ctx.prisma.detectionType.findMany();
      },
    });
    t.list.field("allDetections", {
      type: "Detection",
      resolve: (_, args, ctx) => {
        return ctx.prisma.detection.findMany();
      },
    });
    t.list.field("allCounters", {
      type: "Counter",
      resolve: (_, args, ctx) => {
        return ctx.prisma.counter.findMany();
      },
    });
    t.list.field("allCameras", {
      type: "Camera",
      description:
        "Get all cameras. Optionally you can filter by active (boolean) value",
      args: {
        active: booleanArg({
          required: false,
          description: "Filter camera by active value",
        }),
      },
      resolve: (_, { active }, ctx) => {
        let opts;
        if (active !== null || active !== undefined) {
          opts = { where: { active: { equals: active as boolean } } };
        } else {
          opts = undefined;
        }
        return ctx.prisma.camera.findMany(opts);
      },
    });
  },
});

const Mutation = objectType({
  name: "Mutation",
  definition(t) {
    t.crud.createOneCamera({ alias: "insertCamera" });
    t.crud.createOneCounter({ alias: "insertCounter" });
    t.crud.createOneCamera({ alias: "insertDetection" });
    t.crud.createOneDetectionType({ alias: "insertDetectionType" });
    t.crud.createOneTrajectory({ alias: "insertTrajectory" });
    t.crud.createOneWeather({ alias: "insertWeather" });
  },
});

export const schema = makeSchema({
  types: [
    Camera,
    Counter,
    Query,
    Mutation,
    Detection,
    DetectionType,
    Trajectory,
    Weather,
    LightningCondition,
  ],
  plugins: [nexusPrismaPlugin()],
  outputs: {
    schema: path.resolve(__dirname, "../schema.graphql"),
    typegen: path.resolve(__dirname, `./generated/nexus.ts`),
  },
  typegenAutoConfig: {
    contextType: "Context.Context",
    sources: [
      {
        source: "@prisma/client",
        alias: "prisma",
      },
      {
        source: require.resolve("./context"),
        alias: "Context",
      },
    ],
  },
});
