// /server/controllers/dashboardController.js

const {
  sequelize,
  Inventory,
  Purchase,
  Transfer,
  Assignment,
  Base,
  Asset,
} = require("../models");
const { Op } = require("sequelize"); // Import operators

// @desc    Get dashboard metrics
// @route   GET /api/dashboard
// @access  Private (All roles)
exports.getDashboardMetrics = async (req, res) => {
  // We'll add filters later (date, base, asset type)
  // For now, let's get system-wide totals

  try {
    // 1. Get Total Balances from Inventory
    // We use sequelize.fn to create SQL functions
    const balances = await Inventory.findAll({
      attributes: [
        [sequelize.fn("SUM", sequelize.col("opening_balance")), "totalOpening"],
        [sequelize.fn("SUM", sequelize.col("closing_balance")), "totalClosing"],
      ],
      raw: true, // Returns a plain JSON object
    });

    // 2. Get Total Purchases in period (for now, all time)
    const purchases = await Purchase.findAll({
      attributes: [
        [sequelize.fn("SUM", sequelize.col("quantity")), "totalPurchases"],
      ],
      raw: true,
    });

    // 3. Get Total Transfers In (all transfers to any base)
    const transfersIn = await Transfer.findAll({
      attributes: [
        [sequelize.fn("SUM", sequelize.col("quantity")), "totalTransfersIn"],
      ],
      raw: true,
    });

    // 4. Get Total Transfers Out (all transfers from any base)
    // This is just the same as totalTransfersIn, but we list it for clarity
    const transfersOut = transfersIn[0].totalTransfersIn || 0;

    // 5. Get Total Expended / Assigned
    const assignments = await Assignment.findAll({
      attributes: [
        [
          sequelize.fn("SUM", sequelize.col("quantity")),
          "totalAssignedOrExpended",
        ],
      ],
      raw: true,
    });

    // Format the data
    const metrics = {
      openingBalance: parseInt(balances[0].totalOpening, 10) || 0,
      closingBalance: parseInt(balances[0].totalClosing, 10) || 0,

      // Net Movement = (Purchases + Transfers In) - (Transfers Out + Expended)
      // Note: This logic might need refinement based on exact accounting rules.
      // A simpler Net Movement is just Closing - Opening.

      // Let's use the simpler definition:
      netMovement:
        (parseInt(balances[0].totalClosing, 10) || 0) -
        (parseInt(balances[0].totalOpening, 10) || 0),

      // We'll provide the breakdown for the modal
      movementDetails: {
        purchases: parseInt(purchases[0].totalPurchases, 10) || 0,
        transfersIn: parseInt(transfersIn[0].totalTransfersIn, 10) || 0,
        transfersOut: parseInt(transfersOut, 10) || 0,
        expended: parseInt(assignments[0].totalAssignedOrExpended, 10) || 0,
      },

      totalAssigned: parseInt(assignments[0].totalAssignedOrExpended, 10) || 0,
      totalExpended:
        parseInt(
          await Assignment.sum("quantity", { where: { expended: true } }),
          10
        ) || 0,
    };

    res.json(metrics);
  } catch (error) {
    console.error("Dashboard metrics error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
