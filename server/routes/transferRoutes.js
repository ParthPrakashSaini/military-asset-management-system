// /server/routes/transferRoutes.js

const express = require("express");
const router = express.Router();
const {
  createTransfer,
  getAllTransfers,
} = require("../controllers/transferController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Get all transfers (All roles can see)
router
  .route("/")
  .get(
    protect,
    authorize("Admin", "Base Commander", "Logistics Officer"),
    getAllTransfers
  )

  // Create a transfer (Only Admin and Logistics)
  .post(protect, authorize("Admin", "Logistics Officer"), createTransfer);

module.exports = router;
