// /server/controllers/assetController.js

const { Asset } = require("../models");

// @desc    Get all asset types
// @route   GET /api/assets
// @access  Private (Admin)
exports.getAllAssets = async (req, res) => {
  try {
    const assets = await Asset.findAll({
      order: [
        ["type", "ASC"],
        ["name", "ASC"],
      ],
    });
    res.json(assets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a new asset type
// @route   POST /api/assets
// @access  Private (Admin)
exports.createAsset = async (req, res) => {
  const { name, type, unit } = req.body;

  if (!name || !type || !unit) {
    return res
      .status(400)
      .json({ message: "Name, type, and unit are required" });
  }

  try {
    const asset = await Asset.create({ name, type, unit });
    res.status(201).json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update an asset type
// @route   PUT /api/assets/:id
// @access  Private (Admin)
exports.updateAsset = async (req, res) => {
  const { id } = req.params;
  const { name, type, unit } = req.body;

  try {
    const asset = await Asset.findByPk(id);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    asset.name = name || asset.name;
    asset.type = type || asset.type;
    asset.unit = unit || asset.unit;

    await asset.save();
    res.json(asset);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
