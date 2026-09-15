// routes/dashboardRoutes.js

const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controllers/dashboardController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Only Admins should see the dashboard
router.get("/", protect, authorize("admin"), getDashboardStats);

module.exports = router;