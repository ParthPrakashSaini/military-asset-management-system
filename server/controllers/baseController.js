// /server/controllers/baseController.js

const { Base } = require("../models");

// @desc    Get all bases
// @route   GET /api/bases
// @access  Private (Admin)
exports.getAllBases = async (req, res) => {
  try {
    const bases = await Base.findAll({
      order: [["name", "ASC"]],
    });
    res.json(bases);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create a new base
// @route   POST /api/bases
// @access  Private (Admin)
exports.createBase = async (req, res) => {
  const { name, location } = req.body;

  if (!name) {
    return res.status(400).json({ message: "Name is required" });
  }

  try {
    const baseExists = await Base.findOne({ where: { name } });
    if (baseExists) {
      return res
        .status(400)
        .json({ message: "Base with this name already exists" });
    }

    const base = await Base.create({ name, location });
    res.status(201).json(base);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a base
// @route   PUT /api/bases/:id
// @access  Private (Admin)
exports.updateBase = async (req, res) => {
  const { id } = req.params;
  const { name, location } = req.body;

  try {
    const base = await Base.findByPk(id);

    if (!base) {
      return res.status(404).json({ message: "Base not found" });
    }

    base.name = name || base.name;
    base.location = location || base.location;

    await base.save();
    res.json(base);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};
