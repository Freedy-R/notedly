import { mergeTypeDefs } from "@graphql-tools/merge";
import { readFileSync } from "fs";
import gql from "graphql-tag";

const noteScheme = gql(
  readFileSync("./src/schemes/noteScheme.gql", {
    encoding: "utf-8",
  })
);
const userScheme = gql(
  readFileSync("./src/schemes/userScheme.gql", {
    encoding: "utf-8",
  })
);
const schemes = mergeTypeDefs([noteScheme, userScheme]);
export default schemes;
