// /server/routes/purchaseRoutes.js

const express = require("express");
const router = express.Router();
const {
  createPurchase,
  getAllPurchases,
} = require("../controllers/purchaseController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Get all purchases (All roles can see)
router
  .route("/")
  .get(
    protect,
    authorize("Admin", "Base Commander", "Logistics Officer"),
    getAllPurchases
  )

  // Create a purchase (Only Admin and Logistics)
  .post(protect, authorize("Admin", "Logistics Officer"), createPurchase);

module.exports = router;
