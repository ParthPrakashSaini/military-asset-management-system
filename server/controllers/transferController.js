// /server/controllers/transferController.js

const {
  sequelize,
  Transfer,
  Inventory,
  Asset,
  Base,
  User,
} = require("../models");

// @desc    Create a new transfer
// @route   POST /api/transfers
// @access  Private (Admin, Logistics Officer)
exports.createTransfer = async (req, res) => {
  const { source_base_id, dest_base_id, asset_id, quantity } = req.body;
  const user_id = req.user.id;

  if (source_base_id === dest_base_id) {
    return res
      .status(400)
      .json({ message: "Source and destination base cannot be the same" });
  }

  if (
    !source_base_id ||
    !dest_base_id ||
    !asset_id ||
    !quantity ||
    quantity <= 0
  ) {
    return res
      .status(400)
      .json({
        message:
          "Valid source base, destination base, asset, and quantity are required",
      });
  }

  const t = await sequelize.transaction(); // Start a transaction

  try {
    // Step 1: Find the source inventory
    const sourceInventory = await Inventory.findOne({
      where: { base_id: source_base_id, asset_id },
      transaction: t,
    });

    // Step 2: Check if there's enough stock to transfer
    if (!sourceInventory || sourceInventory.closing_balance < quantity) {
      await t.rollback(); // No need to proceed, roll back
      return res
        .status(400)
        .json({ message: "Insufficient stock at source base" });
    }

    // Step 3: Decrement source inventory
    sourceInventory.closing_balance -= parseInt(quantity, 10);
    await sourceInventory.save({ transaction: t });

    // Step 4: Find or create the destination inventory
    let destInventory = await Inventory.findOne({
      where: { base_id: dest_base_id, asset_id },
      transaction: t,
    });

    if (destInventory) {
      // If it exists, increment it
      destInventory.closing_balance += parseInt(quantity, 10);
      await destInventory.save({ transaction: t });
    } else {
      // If it doesn't exist, create it
      destInventory = await Inventory.create(
        {
          base_id: dest_base_id,
          asset_id,
          opening_balance: 0,
          closing_balance: parseInt(quantity, 10),
        },
        { transaction: t }
      );
    }

    // Step 5: Log the transfer
    const transfer = await Transfer.create(
      {
        source_base_id,
        dest_base_id,
        asset_id,
        quantity,
        user_id,
        status: "Completed", // We'll default to 'Completed' for simplicity
      },
      { transaction: t }
    );

    // If all steps succeeded, commit the transaction
    await t.commit();

    res.status(201).json({ message: "Transfer successful", transfer });
  } catch (error) {
    // If any step failed, roll back
    await t.rollback();
    console.error("Transfer creation failed:", error);
    res
      .status(500)
      .json({ message: "Server error during transfer", error: error.message });
  }
};

// @desc    Get all transfers
// @route   GET /api/transfers
// @access  Private (Admin, Logistics Officer, Base Commander)
exports.getAllTransfers = async (req, res) => {
  try {
    const transfers = await Transfer.findAll({
      order: [["timestamp", "DESC"]],
      include: [
        { model: Asset, attributes: ["name", "unit"] },
        { model: User, attributes: ["name"] },
        { model: Base, as: "SourceBase", attributes: ["name"] },
        { model: Base, as: "DestinationBase", attributes: ["name"] },
      ],
    });
    res.json(transfers);
  } catch (error) {
    console.error("Error fetching transfers:", error);
    res.status(500).json({ message: "Server error" });
  }
};
