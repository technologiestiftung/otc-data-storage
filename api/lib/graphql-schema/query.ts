import { schema } from "nexus";

schema.queryType({
  // name: "Query",
  definition(t) {
    t.crud.camera({ alias: "cameraById" });
    t.crud.counter({ alias: "counterById" });
    t.crud.recording({ alias: "recordingById" });
    t.crud.detection({ alias: "detectionById" });
    t.crud.detectionType({ alias: "detectionTypeById" });
    t.crud.trajectory({ alias: "trajectoryById" });
    t.crud.weather({ alias: "weatherById" });
    t.crud.lightningCondition({ alias: "lightningConditionById" });

    // multiple
    t.crud.lightningConditions({
      alias: "allLightingConditions",
      ordering: true,
      filtering: true,
    });
    t.crud.cameras({ alias: "allCameras", ordering: true, filtering: true });
    t.crud.recordings({
      alias: "allRecordings",
      ordering: true,
      filtering: true,
    });
    t.crud.counters({
      alias: "allCounters",
      ordering: true,
      filtering: true,
    });
    t.crud.weathers({ alias: "allWeathers", ordering: true, filtering: true });
    t.crud.detections({
      alias: "allDetections",
      ordering: true,
      filtering: true,
    });
    t.crud.detectionTypes({
      alias: "allDetectionTypes",
      ordering: true,
      filtering: true,
    });
    t.crud.trajectories({
      alias: "allTrajectories",
      ordering: true,
      filtering: true,
    });

    t.field("me", {
      type: "User",
      async resolve(_root, _args, ctx) {
        console.log(ctx);
        if (ctx.token === null) {
          throw new Error("No token provided");
        }
        /**
         *
         * TODO: Workaround for issue https://github.com/Camji55/nexus-plugin-jwt-auth/issues/23
         */
        const validUser = (ctx.token as unknown) as { userId: number };
        const user = await ctx.db.user.findOne({
          where: {
            id: validUser.userId, // This is the token object passed through the context
          },
        });

        if (!user) {
          throw new Error("No such user exists");
        }

        return user;
      },
    });

    t.list.field("countersByRecordingId", {
      type: "Counter",
      description: "Get all counters from a specific recording",
      args: {
        recordingId: schema.intArg({
          nullable: false,
          description: "The id (Int) of the recording",
        }),
      },
      resolve: (_, { recordingId }, ctx) => {
        return ctx.db.counter.findMany({
          where: { recordingId: recordingId },
        });
      },
    });

    // t.list.field("allCameraByActivity", {
    //   type: "Camera",
    //   description:
    //     "Get all cameras. Optionally you can filter by active (boolean) value",
    //   args: {
    //     active: schema.booleanArg({
    //       required: false,
    //       description: "Filter camera by active value",
    //     }),
    //   },
    //   resolve: (_, { active }, ctx) => {
    //     let opts;
    //     if (active !== null || active !== undefined) {
    //       opts = { where: { active: { equals: active as boolean } } };
    //     } else {
    //       opts = undefined;
    //     }
    //     return ctx.db.camera.findMany(opts);
    //   },
    // });
  },
});
