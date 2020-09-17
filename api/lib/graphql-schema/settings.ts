import { settings } from "nexus";

settings.change({
  // logger: { level: "debug" },

  server: {
    cors: { enabled: true },
    playground: true,
    // playground:
    //   process.env.NODE_ENV === "production"
    //     ? false
    //     : {
    //         enabled: true,
    //       },

    path: "/graphql",
    startMessage: (info) => {
      settings.original.server.startMessage(info);
    },
  },

  schema: {
    generateGraphQLSDLFile: "./api/generated/schema.graphql",
  },
});
