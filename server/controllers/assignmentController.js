// /server/controllers/assignmentController.js

const {
  sequelize,
  Assignment,
  Inventory,
  Asset,
  Base,
  User,
} = require("../models");

// @desc    Create a new assignment or expenditure
// @route   POST /api/assignments
// @access  Private (Admin, Base Commander)
exports.createAssignment = async (req, res) => {
  const { base_id, asset_id, quantity, personnel_name, expended, date } =
    req.body;
  const user_id = req.user.id; // User making the assignment

  if (!base_id || !asset_id || !quantity || quantity <= 0 || !personnel_name) {
    return res
      .status(400)
      .json({
        message: "Valid base, asset, quantity, and personnel name are required",
      });
  }

  const t = await sequelize.transaction(); // Start a transaction

  try {
    // Step 1: Find the inventory at the base
    const inventory = await Inventory.findOne({
      where: { base_id, asset_id },
      transaction: t,
    });

    // Step 2: Check for sufficient stock
    if (!inventory || inventory.closing_balance < quantity) {
      await t.rollback();
      return res
        .status(400)
        .json({ message: "Insufficient stock at base for this assignment" });
    }

    // Step 3: Decrement the inventory
    inventory.closing_balance -= parseInt(quantity, 10);
    await inventory.save({ transaction: t });

    // Step 4: Log the assignment/expenditure
    const assignment = await Assignment.create(
      {
        base_id,
        asset_id,
        user_id,
        personnel_name,
        quantity,
        expended: expended || false, // Default to 'assigned' (not 'expended')
        date: date || new Date(),
      },
      { transaction: t }
    );

    // If all steps succeeded, commit the transaction
    await t.commit();

    res
      .status(201)
      .json({
        message: "Assignment recorded and inventory updated",
        assignment,
      });
  } catch (error) {
    // If any step failed, roll back
    await t.rollback();
    console.error("Assignment creation failed:", error);
    res
      .status(500)
      .json({
        message: "Server error during assignment",
        error: error.message,
      });
  }
};

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private (Admin, Base Commander)
exports.getAllAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.findAll({
      order: [["date", "DESC"]],
      include: [
        { model: Base, attributes: ["name"] },
        { model: Asset, attributes: ["name", "unit"] },
        { model: User, attributes: ["name"] },
      ],
    });
    res.json(assignments);
  } catch (error) {
    console.error("Error fetching assignments:", error);
    res.status(500).json({ message: "Server error" });
  }
};
