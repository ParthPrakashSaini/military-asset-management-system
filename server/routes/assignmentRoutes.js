// /server/routes/assignmentRoutes.js

const express = require("express");
const router = express.Router();
const {
  createAssignment,
  getAllAssignments,
} = require("../controllers/assignmentController");
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/roleMiddleware");

// Protect all assignment routes
router.use(protect);
router.use(authorize("Admin", "Base Commander")); // Only these roles can manage assignments

router.route("/").get(getAllAssignments).post(createAssignment);

module.exports = router;
