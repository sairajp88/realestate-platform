import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  compareProperties,
} from "../controllers/property.controller.js";

const router = express.Router();

// Seller only
router.post("/", authMiddleware, createProperty);

// Public
router.get("/", getAllProperties);

// Compare properties (PUBLIC)
router.post("/compare", compareProperties);

// Public single property
router.get("/:id", getPropertyById);

export default router;
