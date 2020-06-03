import { GraphQLServer, Options } from "graphql-yoga";
import { schema } from "./schema";
import cors from "cors";

import { createContext } from "./context";
import { Response, Request } from "express";
// const prisma = new PrismaClient();

// import * as Query from "./lib/resolvers/queries";
// const resolvers = {
//   Query,
// };
const server = new GraphQLServer({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  schema,
  context: createContext,
});

server.use(cors());
server.get("/", (_request: Request, response: Response) => {
  response.json([1, 2, 3]);
});
const options: Options = { endpoint: "/graphql", playground: "/graphql" };
server.start(options, () => {
  console.log("running REST on          http://localhost:4000");
  console.log("running GraphQLServer on http://localhost:4000/graphql");
  if (options.playground) {
    console.log("running Palyground on    http://localhost:4000/graphql");
  }
});
