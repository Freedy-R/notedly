import models from "../database/models/models.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
const userResolvers = {
  Query: {
    users: async (parent, args, { models }) => {
      return await models.User.find();
    },
    user: async (parent, args, { models }) => {
      return await models.User.findById(args.id);
    },
  },
  Mutation: {
    signUp: async (parent, args) => {
      args.email = args.email.trim().toLowerCase();
      const avatar = gravatar.url(args.email);
      const hashed = await bcrypt.hash(args.password, 10);
      try {
        const existingUser = await models.User.findOne({
          $or: [{ email: args.email }, { username: args.username }],
        });
        if (existingUser) {
          throw new Error("User with this email or username already exists");
        }
        const user = await models.User.create({
          username: args.username,
          password: hashed,
          email: args.email,
          avatar: "https:" + avatar,
        });
        return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      } catch (err) {
        console.error("Error creating account:", err);
        throw new Error("Failed to create account");
      }
    },
    signIn: async (parent, args) => {
      try {
        const user = await models.User.findOne({
          $or: [{ email: args.email }, { username: args.username }],
        });
        if (!user) {
          throw new Error("User with this email does not exist");
        }
        const valid = await bcrypt.compare(args.password, user.password);
        if (!valid) {
          throw new Error("Incorrect password");
        }
        return jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      } catch (err) {
        console.error("Error signing in:", err);
        throw new Error("Failed to sign in");
      }
    },
  },
};

export default userResolvers;
