import { mergeResolvers } from "@graphql-tools/merge";
import noteResolvers from "./noteResolvers.js";
import userResolvers from "./userResolvers.js";

const resolvers = mergeResolvers([noteResolvers, userResolvers]);

export default resolvers;
