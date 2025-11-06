// /server/routes/authRoutes.js

const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");

// POST /api/auth/login
router.post("/login", loginUser);

// POST /api/auth/register
router.post("/register", registerUser);

module.exports = router;
