// /server/routes/baseRoutes.js

const express = require("express");
const router = express.Router();
const {
  getAllBases,
  createBase,
  updateBase,
} = require("../controllers/baseController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// All routes in this file are protected and for Admins only
router.use(protect);
router.use(authorize("Admin"));

// GET /api/bases
router.route("/").get(getAllBases).post(createBase);

// PUT /api/bases/:id
router.route("/:id").put(updateBase);
// We can add DELETE later if needed

module.exports = router;
