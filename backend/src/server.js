import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import healthRoute from "./routes/health.route.js";
import authRoutes from "./routes/auth.route.js";
import protectedRoutes from "./routes/protected.route.js";
import propertyRoutes from "./routes/property.route.js";
import errorHandler from "./middleware/error.middleware.js";

dotenv.config();
connectDB();

const app = express();

// ✅ CORS (production-safe)
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(express.json());

// Routes
app.use("/", healthRoute);
app.use("/auth", authRoutes);
app.use("/api", protectedRoutes);
app.use("/property", propertyRoutes);

// Fallback test
app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Error handler (last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
