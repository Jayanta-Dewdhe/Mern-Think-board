import express from "express";
import dns from "dns";
import cors from "cors"
import dotenv from "dotenv";

import notesRoutes from "./src/routes/notesRoutes.js";
import connectDB from "./src/config/db.js";
import rateLimiter from "./src/middleware/rateLimiter.js";


// Load env variables
dotenv.config();

// DNS config
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();

// Connect DB
connectDB();

// Middlewares
app.use(cors({
  origin: "http://localhost:5173"
})
);

app.use(express.json());
app.use(rateLimiter);

// Logger middleware
app.use((req, res, next) => {
  console.log(`Req method is ${req.method} & Req Url is ${req.url}`);
  next();
});

// Routes
app.use("/api/notes", notesRoutes);

// Start server
app.listen(5001, () => {
  console.log("Server started on Port: 5001");
});