import jwt from "jsonwebtoken";
import models from "./src/database/models/models.js";
const getUser = (token) => {
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("Error verifying token:", err);
      throw new Error("Failed to verify token");
    }
  }
};

const context = async ({ req }) => {
  const token = req.headers.authorization;
  const user = getUser(token);
  return { models: models, user: user };
};

export default context;
