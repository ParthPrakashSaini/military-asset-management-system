// /server/routes/dashboardRoutes.js

const express = require("express");
const router = express.Router();
const { getDashboardMetrics } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// All logged-in users can view the dashboard
router
  .route("/")
  .get(
    protect,
    authorize("Admin", "Base Commander", "Logistics Officer"),
    getDashboardMetrics
  );

module.exports = router;
