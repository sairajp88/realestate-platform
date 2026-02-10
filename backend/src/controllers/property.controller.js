import Property from "../models/Property.model.js";

// CREATE PROPERTY (SELLER ONLY)
export const createProperty = async (req, res, next) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({ message: "Only sellers can add properties" });
    }

    const {
      title,
      description,
      price,
      area,
      city,
      locality,
      amenities,
    } = req.body;

    if (!title || !description || !price || !area || !city || !locality) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const property = await Property.create({
      title,
      description,
      price,
      area,
      city,
      locality,
      amenities,
      sellerId: req.user.id,
    });

    res.status(201).json({
      message: "Property created successfully",
      property,
    });
  } catch (error) {
    next(error);
  }
};

// GET ALL PROPERTIES (PUBLIC)
export const getAllProperties = async (req, res, next) => {
  try {
    const properties = await Property.find()
      .sort({ createdAt: -1 })
      .populate("sellerId", "name");

    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

// GET SINGLE PROPERTY (PUBLIC)
export const getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id).populate(
      "sellerId",
      "name"
    );

    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json(property);
  } catch (error) {
    next(error);
  }
};
