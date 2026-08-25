import express from "express";
import cors from "cors";
import "dotenv/config";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import studentRouter from "./routes/studentRoutes.js";

const PORT = process.env.PORT || 5000;
const app = express();

//Middlewares
app.use(cors());
app.use(express.json());

//DB
connectDB();

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRouter);

//ROUTER
app.get("/", (req, res) => {
  res.send("API WORKING");
});

app.listen(PORT, () => {
  console.log(`Server Started on http://localhost:${PORT}`);
});
