import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import healthRoute from "./routes/health.route.js";
import errorHandler from "./middleware/error.middleware.js";
import authRoutes from "./routes/auth.route.js";
import protectedRoutes from "./routes/protected.route.js";

const app = express();
dotenv.config();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
//ROUTES
app.use("/", healthRoute);
app.use("/auth", authRoutes);
app.use("/api", protectedRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("Backend is running");
});

const PORT = process.env.PORT || 5000;
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
