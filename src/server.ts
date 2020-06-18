import cors from "cors";
import { server, use } from "nexus";
import { prisma } from "nexus-plugin-prisma";
// import { createContext } from "./context";

use(
  prisma({
    client: { options: { log: ["query"] } },
    migrations: true,
    features: { crud: true },
  }),
);
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

server.express.use(cors());
server.express.get("/rest", (_request, response) => {
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
