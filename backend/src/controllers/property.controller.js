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

// COMPARE PROPERTIES (PUBLIC)
export const compareProperties = async (req, res, next) => {
  try {
    const { propertyIds } = req.body;

    // Validate array
    if (!Array.isArray(propertyIds)) {
      return res.status(400).json({
        message: "propertyIds array is required",
      });
    }

    // Validate length (2–3 only)
    if (propertyIds.length < 2 || propertyIds.length > 3) {
      return res.status(400).json({
        message: "You can compare 2 or 3 properties only",
      });
    }

    // Fetch properties
    const properties = await Property.find({
      _id: { $in: propertyIds },
    });

    // Check if all properties exist
    if (properties.length !== propertyIds.length) {
      return res.status(404).json({
        message: "One or more properties not found",
      });
    }

    // Preserve order as sent by frontend
    const orderedProperties = propertyIds.map((id) =>
      properties.find((property) => property._id.toString() === id)
    );

    res.status(200).json({
      properties: orderedProperties,
    });
  } catch (error) {
    next(error);
  }
};
// GET MY PROPERTIES (SELLER ONLY)
export const getMyProperties = async (req, res, next) => {
  try {
    if (req.user.role !== "seller") {
      return res.status(403).json({
        message: "Only sellers can access their properties",
      });
    }

    const properties = await Property.find({
      sellerId: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json(properties);
  } catch (error) {
    next(error);
  }
};

