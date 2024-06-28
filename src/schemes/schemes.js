import { mergeTypeDefs } from "@graphql-tools/merge";
import { readFileSync } from "fs";
import gql from "graphql-tag";

const schemes = gql(
  readFileSync("./src/schemes/schemes.gql", {
    encoding: "utf-8",
  })
);
const noteScheme = gql(
  readFileSync("./src/schemes/noteScheme.gql", {
    encoding: "utf-8",
  })
);
const noteFeedScheme = gql(
  readFileSync("./src/schemes/noteFeedScheme.gql", {
    encoding: "utf-8",
  })
);
const userScheme = gql(
  readFileSync("./src/schemes/userScheme.gql", {
    encoding: "utf-8",
  })
);

const typedefs = mergeTypeDefs([schemes, noteScheme, noteFeedScheme, userScheme]);
export default typedefs;
