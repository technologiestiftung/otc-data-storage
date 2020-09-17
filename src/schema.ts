import { settings, schema } from "nexus";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import { APP_SECRET } from "./lib/envs";

// import { booleanArg } from "@nexus/schema";
// // import { objectType, makeSchema } from "@nexus/schema";
// schema.objectType({
//   name: "AuthPayload",
//   definition(t) {
//     t.string("token");
//     t.field("user", { type: "User" });
//   },
// });

// schema.queryType({
//   definition(t) {

// });

// schema.objectType({
//   name: "User",
//   definition(t) {
//     t.model.id();
//     t.model.password();
//     t.model.name();
//     t.model.email();
//   },
// });

// schema.objectType({
//   name: "Counter",
//   definition(t) {
//     t.model.id();
//     t.model.active();
//     t.model.camera();
//     t.model.cameraId();
//     t.model.street();
//     t.model.streetId();
//     t.model.x1();
//     t.model.y1();
//     t.model.x2();
//     t.model.y2();
//     t.model.line();
//     t.model.direction();
//     t.model.detections({ type: "Detection" });
//   },
// });

// schema.objectType({
//   name: "Camera",
//   definition(t) {
//     t.model.id();
//     t.model.active();
//     t.model.name();
//     t.model.location();
//     t.model.transformationMatrix();
//     t.model.owner();
//     t.model.timezone();
//     t.model.software();
//     t.model.softwareHistory();
//     t.model.hardware();
//     t.model.angle();
//     t.model.geom();
//     t.model.counters({ type: "Counter" });
//     t.model.trajectories({ type: "Trajectory" });
//     t.model.weathers({ type: "Weather" });
//     t.model.lightningConditions({ type: "LightningCondition" });
//   },
// });

// import { makeSchema, objectType, intArg } from "@nexus/schema";
// import { nexusPrismaPlugin } from "nexus-prisma";
// import path from "path";
// import { Counter } from "./Counter";
// import { Camera } from "./Camera";

// schema.objectType({
//   name: "Detection",
//   definition(t) {
//     t.model.id();
//     t.model.detectedAt();
//     t.model.counter();
//     t.model.counterId();
//     t.model.detectionType();
//     t.model.detectionTypeId();
//     t.model.accuracy();
//     t.model.x();
//     t.model.y();
//   },
// });

// schema.objectType({
//   name: "DetectionType",
//   definition(t) {
//     t.model.id();
//     t.model.label();
//     t.model.description();
//     t.model.detections({ type: "Detection" });
//     t.model.trajectories({ type: "Trajectory" });
//   },
// });

// schema.objectType({
//   name: "Weather",
//   definition(t) {
//     t.model.id();
//     t.model.camera();
//     t.model.cameraId();
//     t.model.recordedAt();
//     t.model.humidity();
//     t.model.pressure();
//     t.model.cloudCoverage();
//     t.model.rain();
//     t.model.temperature();
//     t.model.wind();
//     t.model.windDirection();
//   },
// });
// schema.objectType({
//   name: "Trajectory",
//   definition(t) {
//     t.model.id();
//     t.model.camera();
//     t.model.cameraId();
//     t.model.trajectory();
//     t.model.geom();
//     t.model.detectionType();
//     t.model.detectionTypeId();
//     t.model.start();
//     t.model.end();
//   },
// });

// schema.objectType({
//   name: "LightningCondition",
//   definition(t) {
//     t.model.id();
//     t.model.camera();
//     t.model.cameraId();
//     t.model.recordedAt();
//     t.model.value();
//   },
// });
// schema.queryType({
//   // name: "Query",
//   definition(t) {
//     t.crud.camera({ alias: "cameraById" });
//     t.crud.counter({ alias: "counterById" });
//     t.crud.detection({ alias: "detectionById" });
//     t.crud.detectionType({ alias: "detectionTypeById" });
//     t.crud.trajectory({ alias: "trajectoryById" });
//     t.crud.weather({ alias: "weatherById" });
//     t.crud.lightningCondition({ alias: "lightningConditionById" });
//     t.crud.lightningConditions({
//       alias: "allLightingConditions",
//       ordering: true,
//       filtering: true,
//     });
//     t.crud.cameras({ alias: "allCameras", ordering: true, filtering: true });
//     t.crud.weathers({ alias: "allWeathers", ordering: true, filtering: true });
//     t.crud.detections({
//       alias: "allDetections",
//       ordering: true,
//       filtering: true,
//     });
//     t.crud.detectionTypes({
//       alias: "allDetectionTypes",
//       ordering: true,
//       filtering: true,
//     });
//     t.crud.trajectories({
//       alias: "allTrajectories",
//       ordering: true,
//       filtering: true,
//     });
//     t.crud.counters({
//       alias: "allCounters",
//       ordering: true,
//       filtering: true,
//     });
//     t.field("me", {
//       type: "User",
//       async resolve(_root, _args, ctx) {
//         console.log(ctx);
//         if (ctx.token === null) {
//           throw new Error("No token provided");
//         }
//         /**
//          *
//          * TODO: Workaround for issue https://github.com/Camji55/nexus-plugin-jwt-auth/issues/23
//          */
//         const validUser = (ctx.token as unknown) as { userId: number };
//         const user = await ctx.db.user.findOne({
//           where: {
//             id: validUser.userId, // This is the token object passed through the context
//           },
//         });

//         if (!user) {
//           throw new Error("No such user exists");
//         }

//         return user;
//       },
//     });

//     t.list.field("countersByCameraId", {
//       type: "Counter",
//       description: "Get all counters from a specific camera",
//       args: {
//         cameraId: schema.intArg({
//           nullable: false,
//           description: "The id (Int) of the camera",
//         }),
//       },
//       resolve: (_, { cameraId }, ctx) => {
//         return ctx.db.counter.findMany({
//           where: { cameraId: cameraId },
//         });
//       },
//     });

//     t.list.field("allCameraByActivity", {
//       type: "Camera",
//       description:
//         "Get all cameras. Optionally you can filter by active (boolean) value",
//       args: {
//         active: schema.booleanArg({
//           required: false,
//           description: "Filter camera by active value",
//         }),
//       },
//       resolve: (_, { active }, ctx) => {
//         let opts;
//         if (active !== null || active !== undefined) {
//           opts = { where: { active: { equals: active as boolean } } };
//         } else {
//           opts = undefined;
//         }
//         return ctx.db.camera.findMany(opts);
//       },
//     });
//   },
// });

// schema.mutationType({
//   definition(t) {
//     t.crud.createOneCamera({ alias: "insertCamera" });
//     t.crud.createOneCounter({ alias: "insertCounter" });
//     t.crud.createOneCamera({ alias: "insertDetection" });
//     t.crud.createOneDetectionType({ alias: "insertDetectionType" });
//     t.crud.createOneTrajectory({ alias: "insertTrajectory" });
//     t.crud.createOneWeather({ alias: "insertWeather" });
//     // t.field("signup", {
//     //   resolve: async () => {
//     //     return { message: "no signup allowed" };
//     //   },
//     // });
//     t.field("signup", {
//       type: "AuthPayload",
//       args: {
//         name: schema.stringArg(),
//         email: schema.stringArg({ nullable: false }),
//         password: schema.stringArg({ nullable: false }),
//       },
//       resolve: async (_parent, { name, email, password }, ctx) => {
//         const hashedPassword = await hash(password, 10);
//         const user = await ctx.db.user.create({
//           data: {
//             name,
//             email,
//             password: hashedPassword,
//           },
//         });
//         return {
//           token: sign({ userId: user.id }, APP_SECRET),
//           user,
//         };
//       },
//     });

//     t.field("login", {
//       type: "AuthPayload",
//       args: {
//         email: schema.stringArg({ nullable: false }),
//         password: schema.stringArg({ nullable: false }),
//       },
//       resolve: async (_parent, { email, password }, context) => {
//         const user = await context.db.user.findOne({
//           where: {
//             email,
//           },
//         });
//         if (!user) {
//           throw new Error(`No user found for email: ${email}`);
//         }
//         const passwordValid = await compare(password, user.password);
//         if (!passwordValid) {
//           throw new Error("Invalid password");
//         }
//         return {
//           token: sign({ userId: user.id }, APP_SECRET),
//           user,
//         };
//       },
//     });
//   },
// });

// settings.change({
//   // logger: { level: "debug" },

//   server: {
//     cors: { enabled: true },
//     playground: true,
//     // playground:
//     //   process.env.NODE_ENV === "production"
//     //     ? false
//     //     : {
//     //         enabled: true,
//     //       },

//     path: "/graphql",
//     startMessage: (info) => {
//       settings.original.server.startMessage(info);
//     },
//   },

//   schema: {
//     generateGraphQLSDLFile: "./src/generated/schema.graphql",
//   },
// });
