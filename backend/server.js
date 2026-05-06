import express from "express";
import dns from "dns";
import cors from "cors"
import dotenv from "dotenv";
import path from "path";

import notesRoutes from "./src/routes/notesRoutes.js";
import connectDB from "./src/config/db.js";
import rateLimiter from "./src/middleware/rateLimiter.js";


// Load env variables
dotenv.config();

// DNS config
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
const __dirname = path.resolve()

// Connect DB
connectDB();

// Middlewares

if(process.env.NODE_ENV !== "production"){
app.use(cors({
  origin: "http://localhost:5173"
})
);

}


app.use(express.json());
app.use(rateLimiter);

// Logger middleware
app.use((req, res, next) => {
  console.log(`Req method is ${req.method} & Req Url is ${req.url}`);
  next();
});

// Routes
app.use("/api/notes", notesRoutes);

if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");

  app.use(express.static(frontendPath));

  app.use((req, res) => {
    res.sendFile(path.join(frontendPath, "index.html"));
  });
}

// Start server
app.listen(5001, () => {
  console.log("Server started on Port: 5001");
});