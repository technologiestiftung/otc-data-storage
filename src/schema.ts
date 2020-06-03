// import { objectType, makeSchema } from "@nexus/schema";

import { makeSchema, objectType } from "@nexus/schema";
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
  },
});
const Query = objectType({
  name: "Query",
  definition(t) {
    t.crud.camera();
    t.crud.counter();
    t.crud.detection();
    t.crud.detectionType();

    t.list.field("detectionTypes", {
      type: "DetectionType",
      resolve: (_, args, ctx) => {
        return ctx.prisma.detectionType.findMany();
      },
    });
    t.list.field("detections", {
      type: "Detection",
      resolve: (_, args, ctx) => {
        return ctx.prisma.detection.findMany();
      },
    });
    t.list.field("counters", {
      type: "Counter",
      resolve: (_, args, ctx) => {
        return ctx.prisma.counter.findMany();
      },
    });
    t.list.field("cameras", {
      type: "Camera",
      resolve: (_, args, ctx) => {
        return ctx.prisma.camera.findMany();
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
    t.crud.createOneDetectionType({ alias: "insertDetection" });
  },
});
export const schema = makeSchema({
  types: [Camera, Counter, Query, Mutation, Detection, DetectionType],
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
