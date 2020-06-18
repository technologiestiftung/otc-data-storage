"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var cors_1 = __importDefault(require("cors"));
var nexus_1 = require("nexus");
var nexus_plugin_prisma_1 = require("nexus-plugin-prisma");
// import { createContext } from "./context";
nexus_1.use(nexus_plugin_prisma_1.prisma({
    client: { options: { log: ["query"] } },
    migrations: true,
    features: { crud: true }
}));
// const prisma = new PrismaClient();
// import * as Query from "./lib/resolvers/queries";
// const resolvers = {
//   Query,
// };
// const server = new GraphQLServer({
//   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//   //@ts-ignore
//   schema,
//   context: createContext,
// });
nexus_1.server.express.use(cors_1["default"]());
nexus_1.server.express.get("/rest", function (_request, response) {
    response.json([1, 2, 3]);
});
// const options: Options = { endpoint: "/graphql", playground: "/graphql" };
// server.express.listen(() => {
//   console.log("running REST on          http://localhost:4000");
//   console.log("running GraphQLServer on http://localhost:4000/graphql");
//   // if (options.playground) {
//   console.log("running Palyground on    http://localhost:4000/graphql");
//   // }
// });
//# sourceMappingURL=server.js.map