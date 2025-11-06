// /server/routes/assetRoutes.js

const express = require("express");
const router = express.Router();
const {
  getAllAssets,
  createAsset,
  updateAsset,
} = require("../controllers/assetController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// All routes in this file are protected and for Admins only
router.use(protect);
router.use(authorize("Admin"));

// GET /api/assets
router.route("/").get(getAllAssets).post(createAsset);

// PUT /api/assets/:id
router.route("/:id").put(updateAsset);

module.exports = router;
