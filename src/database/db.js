import mongoose from "mongoose";
const DB_HOST = process.env.DB_HOST;
export const connect = () => {
  mongoose.connect(DB_HOST);
  mongoose.connection.on("error", (err) => {
    console.error(err);
    process.exit(1);
  });
  mongoose.connection.on("connected", () => {
    console.log("Mongoose is connected");
  });
  mongoose.connection.on("disconnected", () => {
    console.log("Mongoose is disconnected");
  });
  process.on("SIGINT", async () => {
    try {
      await mongoose.connection.close();
      console.log("Mongoose is disconnected through app termination");
      process.exit(0);
    } catch (err) {
      console.error("Error while disconnecting from Mongoose:", err);
      process.exit(1);
    }
  });
};

export const disconnect = () => {
  mongoose.connection.close();
};
