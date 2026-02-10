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
const allowedOrigins = [
  "https://propchains.vercel.app",
  "http://localhost:5173"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server & Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
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
