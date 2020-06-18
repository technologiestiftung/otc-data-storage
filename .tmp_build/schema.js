"use strict";
exports.__esModule = true;
var nexus_1 = require("nexus");
// import { booleanArg } from "@nexus/schema";
// // import { objectType, makeSchema } from "@nexus/schema";
nexus_1.schema.objectType({
    name: "Counter",
    definition: function (t) {
        t.model.id();
        t.model.active();
        t.model.camera();
        t.model.cameraId();
        t.model.street();
        t.model.streetId();
        t.model.x1();
        t.model.y1();
        t.model.x2();
        t.model.y2();
        t.model.line();
        t.model.direction();
        t.model.detections({ type: "Detection" });
    }
});
nexus_1.schema.objectType({
    name: "Camera",
    definition: function (t) {
        t.model.id();
        t.model.active();
        t.model.name();
        t.model.location();
        t.model.transformationMatrix();
        t.model.owner();
        t.model.timezone();
        t.model.software();
        t.model.softwareHistory();
        t.model.hardware();
        t.model.angle();
        t.model.geom();
        t.model.counters({ type: "Counter" });
        t.model.trajectories({ type: "Trajectory" });
        t.model.weathers({ type: "Weather" });
        t.model.lightningConditions({ type: "LightningCondition" });
    }
});
// import { makeSchema, objectType, intArg } from "@nexus/schema";
// import { nexusPrismaPlugin } from "nexus-prisma";
// import path from "path";
// import { Counter } from "./Counter";
// import { Camera } from "./Camera";
nexus_1.schema.objectType({
    name: "Detection",
    definition: function (t) {
        t.model.id();
        t.model.detectedAt();
        t.model.counter();
        t.model.counterId();
        t.model.detectionType();
        t.model.detectionTypeId();
        t.model.accuracy();
        t.model.x();
        t.model.y();
    }
});
nexus_1.schema.objectType({
    name: "DetectionType",
    definition: function (t) {
        t.model.id();
        t.model.label();
        t.model.description();
        t.model.detections({ type: "Detection" });
        t.model.trajectories({ type: "Trajectory" });
    }
});
nexus_1.schema.objectType({
    name: "Weather",
    definition: function (t) {
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
    }
});
nexus_1.schema.objectType({
    name: "Trajectory",
    definition: function (t) {
        t.model.id();
        t.model.camera();
        t.model.cameraId();
        t.model.trajectory();
        t.model.geom();
        t.model.detectionType();
        t.model.detectionTypeId();
        t.model.start();
        t.model.end();
    }
});
nexus_1.schema.objectType({
    name: "LightningCondition",
    definition: function (t) {
        t.model.id();
        t.model.camera();
        t.model.cameraId();
        t.model.recordedAt();
        t.model.value();
    }
});
nexus_1.schema.queryType({
    // name: "Query",
    definition: function (t) {
        t.crud.camera({ alias: "cameraById" });
        t.crud.counter({ alias: "counterById" });
        t.crud.detection({ alias: "detectionById" });
        t.crud.detectionType({ alias: "detectionTypeById" });
        t.crud.trajectory({ alias: "trajectoryById" });
        t.crud.weather({ alias: "weatherById" });
        t.crud.lightningCondition({ alias: "lightningConditionById" });
        t.crud.lightningConditions({
            alias: "allLightingConditions",
            ordering: true,
            filtering: true
        });
        t.crud.cameras({ alias: "allCameras", ordering: true, filtering: true });
        t.crud.weathers({ alias: "allWeathers", ordering: true, filtering: true });
        t.crud.detections({
            alias: "allDetections",
            ordering: true,
            filtering: true
        });
        t.crud.detectionTypes({
            alias: "allDetectionTypes",
            ordering: true,
            filtering: true
        });
        t.crud.trajectories({
            alias: "allTrajectories",
            ordering: true,
            filtering: true
        });
        t.crud.counters({
            alias: "allCounters",
            ordering: true,
            filtering: true
        });
        t.list.field("countersByCameraId", {
            type: "Counter",
            description: "Get all counters from a specific camera",
            args: {
                cameraId: nexus_1.schema.intArg({
                    nullable: false,
                    description: "The id (Int) of the camera"
                })
            },
            resolve: function (_, _a, ctx) {
                var cameraId = _a.cameraId;
                return ctx.prisma.counter.findMany({
                    where: { cameraId: cameraId }
                });
            }
        });
        // t.list.field("allWeathers", {
        //   type: "Weather",
        //   resolve: (_, args, ctx) => {
        //     return ctx.prisma.weather.findMany();
        //   },
        // });
        // t.list.field("allTrajectories", {
        //   type: "Trajectory",
        //   resolve: (_, args, ctx) => {
        //     return ctx.prisma.trajectory.findMany();
        //   },
        // });
        // t.list.field("allDetectionTypes", {
        //   type: "DetectionType",
        //   resolve: (_, args, ctx) => {
        //     return ctx.prisma.detectionType.findMany();
        //   },
        // });
        // t.list.field("allDetections", {
        //   type: "Detection",
        //   resolve: (_, args, ctx) => {
        //     return ctx.prisma.detection.findMany();
        //   },
        // });
        // t.list.field("allCounters", {
        //   type: "Counter",
        //   resolve: (_, args, ctx) => {
        //     return ctx.prisma.counter.findMany();
        //   },
        // });
        t.list.field("allCameraByActivity", {
            type: "Camera",
            description: "Get all cameras. Optionally you can filter by active (boolean) value",
            args: {
                active: nexus_1.schema.booleanArg({
                    required: false,
                    description: "Filter camera by active value"
                })
            },
            resolve: function (_, _a, ctx) {
                var active = _a.active;
                var opts;
                if (active !== null || active !== undefined) {
                    opts = { where: { active: { equals: active } } };
                }
                else {
                    opts = undefined;
                }
                return ctx.prisma.camera.findMany(opts);
            }
        });
    }
});
nexus_1.schema.mutationType({
    definition: function (t) {
        t.crud.createOneCamera({ alias: "insertCamera" });
        t.crud.createOneCounter({ alias: "insertCounter" });
        t.crud.createOneCamera({ alias: "insertDetection" });
        t.crud.createOneDetectionType({ alias: "insertDetectionType" });
        t.crud.createOneTrajectory({ alias: "insertTrajectory" });
        t.crud.createOneWeather({ alias: "insertWeather" });
    }
});
// export const schema = makeSchema({
//   types: [
//     Camera,
//     Counter,
//     Query,
//     Mutation,
//     Detection,
//     DetectionType,
//     Trajectory,
//     Weather,
//     LightningCondition,
//   ],
//   plugins: [nexusPrismaPlugin()],
//   outputs: {
//     schema: path.resolve(__dirname, "../schema.graphql"),
//     typegen: path.resolve(__dirname, `./generated/nexus.ts`),
//   },
//   typegenAutoConfig: {
//     contextType: "Context.Context",
//     sources: [
//       {
//         source: "@prisma/client",
//         alias: "prisma",
//       },
//       {
//         source: require.resolve("./context"),
//         alias: "Context",
//       },
//     ],
//   },
// });
nexus_1.settings.change({
    // logger: { level: "debug" },
    server: {
        playground: true,
        startMessage: function (info) {
            nexus_1.settings.original.server.startMessage(info);
        }
    },
    schema: {
        generateGraphQLSDLFile: "./src/generated/schema.graphql"
    }
});
//# sourceMappingURL=schema.js.map