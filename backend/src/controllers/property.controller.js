import mongoose from "mongoose";
import Property from "../models/Property.model.js";

/**
 * Seller: create property
 */
export const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      area,
      city,
      locality,
      amenities,
      sellerContact,
    } = req.body;

    if (!sellerContact) {
      return res.status(400).json({ message: "Seller contact is required" });
    }

    const property = await Property.create({
      title,
      description,
      price,
      area,
      city,
      locality,
      amenities,
      sellerContact,
      sellerId: req.user._id, // ✅ now defined
    });

    res.status(201).json(property);
  } catch (err) {
    console.error("createProperty error:", err);
    res.status(500).json({ message: "Failed to create property" });
  }
};

/**
 * Public: get all properties
 */
export const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.json(properties);
  } catch {
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};

/**
 * Public: get single property
 */
export const getPropertyById = async (req, res) => {
  const { id } = req.params;

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }

  try {
    const property = await Property.findById(id);
    if (!property)
      return res.status(404).json({ message: "Property not found" });

    res.json(property);
  } catch {
    res.status(500).json({ message: "Failed to fetch property" });
  }
};

/**
 * Public: compare properties
 */
export const compareProperties = async (req, res) => {
  try {
    const { propertyIds } = req.body;

    const properties = await Property.find({
      _id: { $in: propertyIds },
    });

    res.json({ properties });
  } catch {
    res.status(500).json({ message: "Comparison failed" });
  }
};

/**
 * Seller: get own properties
 */
export const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({
      sellerId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(properties);
  } catch {
    res.status(500).json({ message: "Failed to fetch properties" });
  }
};
