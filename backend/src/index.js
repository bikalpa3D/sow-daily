import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { configDotenv } from "dotenv";

configDotenv();

const app = express();

// Get allowed origins from .env or use default
const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : ["http://localhost:3000"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(cookieParser());

// Import routes
import authRoutes from "./routes/auth.route.js";
import languageRoutes from "./routes/language.routes.js";
import { Port } from "./constant.js";

// Use routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/languages", languageRoutes);

function startServer() {
  app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
  });

  app.get("/health-check", (req, res) => {
    res.status(200).json({
      message: "Server is running",
    });
  });
}

startServer();
