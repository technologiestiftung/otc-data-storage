import cors from "cors";
import { server, use } from "nexus";
import { prisma } from "nexus-plugin-prisma";
import { auth } from "nexus-plugin-jwt-auth";
import { protectedPaths } from "./permissions";
export const APP_SECRET = process.env.APP_SECRET || "superdupersecret";
use(
  prisma({
    client: { options: { log: ["query"] } },
    migrations: true,
    features: { crud: true },
  }),
);

use(
  auth({
    appSecret: APP_SECRET,
    protectedPaths,
  }),
);

server.express.use(cors());
server.express.get("/rest", (_request, response) => {
  response.json([1, 2, 3]);
});
