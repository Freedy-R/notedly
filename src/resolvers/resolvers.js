import { mergeResolvers } from "@graphql-tools/merge";
import noteResolvers from "./noteResolvers.js";
import userResolvers from "./userResolvers.js";
import queryResolvers from "./queryResolvers.js";

const resolvers = mergeResolvers([queryResolvers, noteResolvers, userResolvers]);

export default resolvers;
