import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import https from "https"; // Import https for the keep-alive ping

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";
import userRoutes from "./routes/user.routes.js";

import connectToMongoDB from "./db/connectToMongoDB.js";
import { app, server } from "./socket/socket.js";

dotenv.config();

const __dirname = path.resolve();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());

// Cache control for static files
app.use(express.static(path.join(__dirname, "/frontend/dist"), {
  maxAge: "1d", // Cache for one day
}));

// Define API routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
});

server.listen(PORT, () => {
  connectToMongoDB();
  console.log(`Server Running on port ${PORT}`);
});

// Keep the server awake on Render
setInterval(() => {
  https.get('https://mern-chat-app-by-vishal.onrender.com', (res) => {
    console.log(`Server hit with status code: ${res.statusCode}`);
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
  });
}, 2 * 60 * 1000); // Ping the server every 2 minutes (120000 ms)
