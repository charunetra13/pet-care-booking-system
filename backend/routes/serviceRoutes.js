// routes/serviceRoutes.js

const express = require("express");
const router = express.Router();
const { createService, getServices, updateService, deleteService } = require("../controllers/serviceController");
const { protect, authorize } = require("../middleware/authMiddleware");

// Only logged-in Care Providers (or Admins) can create a service
router.post("/", protect, authorize("careProvider", "admin"), createService);

// Anyone logged in can view all services
router.get("/", protect, getServices);

// Only the provider (or admin) can update/delete - ownership is double-checked inside the controller too
router.put("/:id", protect, updateService);
router.delete("/:id", protect, deleteService);

module.exports = router;