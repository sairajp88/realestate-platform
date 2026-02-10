import express from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import {
  createProperty,
  getAllProperties,
  getPropertyById,
} from "../controllers/property.controller.js";

const router = express.Router();

// Seller only
router.post("/", authMiddleware, createProperty);

// Public
router.get("/", getAllProperties);
router.get("/:id", getPropertyById);

export default router;
