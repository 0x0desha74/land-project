const Land = require('./land.model');

// Send error message
const errorResponse = (res, status, message) => {
  return res.status(status).json({ message });
};

// Send success message
const successResponse = (res, status, message, data = null) => {
  const response = { message };
  if (data) response.data = data;
  return res.status(status).json(response);
};

// Add new land
const createLand = async (req, res) => {
  try {
    const newLand = new Land(req.body);
    const savedLand = await newLand.save();
    
    return successResponse(res, 201, 'Land added successfully', savedLand);
  } catch (error) {
    console.error('Error adding land:', error);
    return errorResponse(res, 500, 'Failed to add land');
  }
};

// Get all lands
const getAllLands = async (req, res) => {
  try {
    const lands = await Land.find().sort({ createdAt: -1 });
    return successResponse(res, 200, 'Lands retrieved successfully', { lands });
  } catch (error) {
    console.error('Error fetching lands:', error);
    return errorResponse(res, 500, 'Failed to fetch lands');
  }
};

// Get one land
const getLandById = async (req, res) => {
  try {
    const land = await Land.findById(req.params.id);
    if (!land) {
      return errorResponse(res, 404, 'Land not found');
    }
    return successResponse(res, 200, 'Land retrieved successfully', land);
  } catch (error) {
    console.error('Error fetching land:', error);
    return errorResponse(res, 500, 'Failed to fetch land');
  }
};

// Update land info
const updateLand = async (req, res) => {
  try {
    const updatedLand = await Land.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updatedLand) {
      return errorResponse(res, 404, 'Land not found');
    }
    
    return successResponse(res, 200, 'Land updated successfully', updatedLand);
  } catch (error) {
    console.error('Error updating land:', error);
    return errorResponse(res, 500, 'Failed to update land');
  }
};

// Remove land
const deleteLand = async (req, res) => {
  try {
    const deletedLand = await Land.findByIdAndDelete(req.params.id);
    if (!deletedLand) {
      return errorResponse(res, 404, 'Land not found');
    }
    return successResponse(res, 200, 'Land removed successfully');
  } catch (error) {
    console.error('Error removing land:', error);
    return errorResponse(res, 500, 'Failed to remove land');
  }
};

// Get popular lands
const getTrendingLands = async (req, res) => {
  try {
    const trendingLands = await Land.find({ isTrending: true })
      .sort({ createdAt: -1 })
      .limit(6);
      
    return successResponse(res, 200, 'Trending lands retrieved successfully', { lands: trendingLands });
  } catch (error) {
    console.error('Error fetching trending lands:', error);
    return errorResponse(res, 500, 'Failed to fetch trending lands');
  }
};

module.exports = {
  createLand,
  getAllLands,
  getLandById,
  updateLand,
  deleteLand,
  getTrendingLands
}; 