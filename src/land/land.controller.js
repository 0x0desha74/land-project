const Land = require("./land.model");

// Error response helper
const errorResponse = (res, status, message) => {
  return res.status(status).json({ message });
};

// Success response helper
const successResponse = (res, status, message, data = null) => {
  const response = { message };
  if (data) response.data = data;
  return res.status(status).json(response);
};

// Create new land
const postLand = async (req, res) => {
  try {
    const newLand = new Land(req.body);
    const savedLand = await newLand.save();
    return successResponse(res, 201, "Land posted successfully", savedLand);
  } catch (error) {
    console.error("Error creating land:", error);
    return errorResponse(res, 500, "Failed to create land");
  }
};

// Get all lands
const getAllLands = async (req, res) => {
  try {
    const lands = await Land.find()
      .sort({ createdAt: -1 })
      .lean();
    return successResponse(res, 200, "Lands retrieved successfully", { lands });
  } catch (error) {
    console.error("Error fetching lands:", error);
    return errorResponse(res, 500, "Failed to fetch lands");
  }
};

// Get single land
const getSingleLand = async (req, res) => {
  try {
    const { id } = req.params;
    const land = await Land.findById(id).lean();
    
    if (!land) {
      return errorResponse(res, 404, "Land not found");
    }
    
    return successResponse(res, 200, "Land retrieved successfully", { land });
  } catch (error) {
    console.error("Error fetching land:", error);
    return errorResponse(res, 500, "Failed to fetch land");
  }
};

// Update land
const UpdateLand = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLand = await Land.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).lean();
    
    if (!updatedLand) {
      return errorResponse(res, 404, "Land not found");
    }
    
    return successResponse(res, 200, "Land updated successfully", updatedLand);
  } catch (error) {
    console.error("Error updating land:", error);
    return errorResponse(res, 500, "Failed to update land");
  }
};

// Delete land
const deleteALand = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLand = await Land.findByIdAndDelete(id).lean();
    
    if (!deletedLand) {
      return errorResponse(res, 404, "Land not found");
    }
    
    return successResponse(res, 200, "Land deleted successfully", deletedLand);
  } catch (error) {
    console.error("Error deleting land:", error);
    return errorResponse(res, 500, "Failed to delete land");
  }
};

module.exports = {
  postLand,
  getAllLands,
  getSingleLand,
  UpdateLand,
  deleteALand
};