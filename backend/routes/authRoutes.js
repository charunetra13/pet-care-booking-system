// routes/authRoutes.js

const express = require("express");
const router = express.Router(); // creates a mini "mini-app" just for routing
const { registerUser, loginUser } = require("../controllers/authController");

// When a POST request hits /api/auth/register, run registerUser function
router.post("/register", registerUser);

// When a POST request hits /api/auth/login, run loginUser function
router.post("/login", loginUser);

module.exports = router;