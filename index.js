import e from "express";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import { createComplexityLimitRule } from "graphql-validation-complexity";
import http from "http";
import cors from "cors";
import typeDefs from "./src/schemes/schemes.js";
import resolvers from "./src/resolvers/resolvers.js";
import * as db from "./src/database/db.js";
import depthLimit from "graphql-depth-limit";

import context from "./context.js";

const app = e();
const httpServer = http.createServer(app);
const port = process.env.PORT || 5050;
const PATH_TO_API = process.env.PATH_TO_API;
const DB_HOST = process.env.DB_HOST;
db.connect(DB_HOST);

const server = new ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
  introspection: process.env.NODE_ENV !== "production",
  validationRules: [depthLimit(5), createComplexityLimitRule(1000)],
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();

app.use(
  PATH_TO_API,
  cors(),
  e.json(),
  expressMiddleware(server, {
    context: context,
  })
);

await new Promise((resolve) => httpServer.listen(port, resolve));

console.log(`🚀 Server ready at http://localhost:${port}${PATH_TO_API}`);
