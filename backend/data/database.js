import mongoose from "mongoose";

export const connectDB = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "tasmay",
    })
    .then((data) => console.log(`MongoDB connected: ${data.connection.host}`));
};
