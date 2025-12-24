import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import { Server } from "socket.io";
import { initSocket } from "./socket/index.js";

import { createServer } from "http";
import dotenv from "dotenv";
import documentRoute from "./routes/document.route.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
  transports: ["websocket", "polling"],
  pingInterval: 5000,
  pingTimeout: 7000,
});
initSocket(io);

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/documents", documentRoute);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in environment variables");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
};
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
