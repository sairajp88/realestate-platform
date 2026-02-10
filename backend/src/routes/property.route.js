import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
  compareProperties,
  getMyProperties,
} from "../controllers/property.controller.js";

const router = express.Router();

// Seller only
router.post("/", authMiddleware, createProperty);

// Public
router.get("/", getAllProperties);

// Compare properties (public)
router.post("/compare", compareProperties);

// Seller: get own properties
router.get("/my", authMiddleware, getMyProperties);

// Public single property
router.get("/:id", getPropertyById);

export default router;
