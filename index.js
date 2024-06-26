import e from "express";
import { ApolloServer } from "@apollo/server";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { expressMiddleware } from "@apollo/server/express4";
import http from "http";
import cors from "cors";
import schemes from "./src/schemes/schemes.js";
import resolvers from "./src/resolvers/resolvers.js";
import * as db from "./src/database/db.js";

const app = e();
const httpServer = http.createServer(app);
const port = process.env.PORT || 5050;
const PATH_TO_API = process.env.PATH_TO_API;
const DB_HOST = process.env.DB_HOST;

db.connect(DB_HOST);

const server = new ApolloServer({
  typeDefs: schemes,
  resolvers: resolvers,
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});
await server.start();
app.use(
  PATH_TO_API,
  cors(),
  e.json(),
  expressMiddleware(server, { context: async ({ req }) => ({ token: req.headers.token }) })
);

await new Promise((resolve) => httpServer.listen(port, resolve));

console.log(`🚀 Server ready at http://localhost:${port}${PATH_TO_API}`);
