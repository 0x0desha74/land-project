const Land = require("./land.model");





const postLand = async (req, res) => {
  try {
    const newLand = await Land({...req.body});
    await newLand.save();
    res.status(200).send({
      message: "Land posted successfully",
      land: newLand
    })
  } catch (error) {
    console.error("Error creating land:", error);
    res.status(500).send({
      message: "Failed to create land",
    })
  }
}

// get all lands

const getAllLands = async (req, res) => {
  try {
    const lands = await Land.find().sort({createdAt: -1});
    res.status(200).send({lands})
  } catch (error) {
    console.error("Error fetching lands:", error);
    res.status(500).send({
      message: "Failed to fetch lands",
    })
  }
}

// get single land
const getSingleLand = async (req, res) => {
  try {
    const { id } = req.params;
    const land = await Land.findById(id);
    if (!land) {
      return res.status(404).send({
        message: "Land not found",
      })
    }
    res.status(200).send({land})
  } catch (error) {
    console.error("Error fetching land:", error);
    res.status(500).send({
      message: "Failed to fetch land",
    })
  }
}

// update land
const UpdateLand = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedLand = await Land.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedLand) {
      return res.status(404).send({
        message: "Land not found",
      })
    }
    res.status(200).send({
      message: "Land updated successfully",
      land: updatedLand
    })
  } catch (error) {
    console.error("Error updating a land:", error);
    res.status(500).send({
      message: "Failed to update a land",
    })
  }
}

// delete land

const deleteALand = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedLand = await Land.findByIdAndDelete(id);
    if (!deletedLand) {
      return res.status(404).send({
        message: "Land not found",
      })
    }
    res.status(200).send({
      message: "Land deleted successfully",
      land: deletedLand
    })
  } catch (error) {
    console.error("Error deleting a land:", error);
    res.status(500).send({
      message: "Failed to delete a land",
    })
  }
};

module.exports = {
  postLand,
  getAllLands,
  getSingleLand,
  UpdateLand,
  deleteALand
}