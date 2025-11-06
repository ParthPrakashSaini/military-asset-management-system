// /server/controllers/purchaseController.js

const {
  sequelize,
  Purchase,
  Inventory,
  Asset,
  Base,
  User,
} = require("../models");

// @desc    Create a new purchase
// @route   POST /api/purchases
// @access  Private (Admin, Logistics Officer)
exports.createPurchase = async (req, res) => {
  const { base_id, asset_id, quantity, date } = req.body;
  const user_id = req.user.id;

  // Simple validation
  if (!base_id || !asset_id || !quantity || quantity <= 0) {
    return res
      .status(400)
      .json({ message: "Valid base, asset, and quantity are required" });
  }

  const t = await sequelize.transaction(); // Start a transaction

  try {
    // Step 1: Log the purchase
    const purchase = await Purchase.create(
      {
        base_id,
        asset_id,
        quantity,
        date: date || new Date(),
        user_id,
      },
      { transaction: t }
    );

    // Step 2: Find or create the inventory record for this asset at this base
    let inventory = await Inventory.findOne({
      where: { base_id, asset_id },
      transaction: t,
    });

    if (inventory) {
      // If record exists, update the closing balance
      inventory.closing_balance += parseInt(quantity, 10);
      await inventory.save({ transaction: t });
    } else {
      // If no record, create one.
      // We assume opening balance is 0 for a new asset at a base.
      inventory = await Inventory.create(
        {
          base_id,
          asset_id,
          opening_balance: 0,
          closing_balance: parseInt(quantity, 10),
        },
        { transaction: t }
      );
    }

    // If all steps succeeded, commit the transaction
    await t.commit();

    res.status(201).json({
      message: "Purchase recorded and inventory updated",
      purchase,
      inventory,
    });
  } catch (error) {
    // If any step failed, roll back the transaction
    await t.rollback();
    console.error("Purchase creation failed:", error);
    res.status(500).json({
      message: "Server error during purchase creation",
      error: error.message,
    });
  }
};

// @desc    Get all purchases
// @route   GET /api/purchases
// @access  Private (Admin, Logistics Officer, Base Commander)
exports.getAllPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.findAll({
      order: [["date", "DESC"]],
      include: [
        { model: Base, attributes: ["name"] },
        { model: Asset, attributes: ["name", "unit"] },
        { model: User, attributes: ["name", "email"] },
      ],
    });
    res.json(purchases);
  } catch (error) {
    console.error("Error fetching purchases:", error);
    res.status(500).json({ message: "Server error" });
  }
};
