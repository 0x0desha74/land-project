const { Land } = require('../models');

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
const createLand = async (req, res) => {
  try {
    const land = await Land.create(req.body);
    return successResponse(res, 201, 'Land created successfully', land);
  } catch (error) {
    console.error('Error creating land:', error);
    return errorResponse(res, 500, 'Failed to create land');
  }
};

// Get all lands
const getAllLands = async (req, res) => {
  try {
    const lands = await Land.findAll();
    return successResponse(res, 200, 'Lands retrieved successfully', lands);
  } catch (error) {
    console.error('Error fetching lands:', error);
    return errorResponse(res, 500, 'Failed to fetch lands');
  }
};

// Get land by ID
const getLandById = async (req, res) => {
  try {
    const { id } = req.params;
    const land = await Land.findByPk(id);
    
    if (!land) {
      return errorResponse(res, 404, 'Land not found');
    }
    
    return successResponse(res, 200, 'Land retrieved successfully', land);
  } catch (error) {
    console.error('Error fetching land:', error);
    return errorResponse(res, 500, 'Failed to fetch land');
  }
};

// Update land
const updateLand = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Land.update(req.body, {
      where: { id }
    });
    
    if (!updated) {
      return errorResponse(res, 404, 'Land not found');
    }
    
    const updatedLand = await Land.findByPk(id);
    return successResponse(res, 200, 'Land updated successfully', updatedLand);
  } catch (error) {
    console.error('Error updating land:', error);
    return errorResponse(res, 500, 'Failed to update land');
  }
};

// Delete land
const deleteLand = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Land.destroy({
      where: { id }
    });
    
    if (!deleted) {
      return errorResponse(res, 404, 'Land not found');
    }
    
    return successResponse(res, 200, 'Land deleted successfully');
  } catch (error) {
    console.error('Error deleting land:', error);
    return errorResponse(res, 500, 'Failed to delete land');
  }
};

// Get trending lands
const getTrendingLands = async (req, res) => {
  try {
    const lands = await Land.findAll({
      where: { trending: true }
    });
    return successResponse(res, 200, 'Trending lands retrieved successfully', lands);
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