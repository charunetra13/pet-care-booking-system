// routes/bookingRoutes.js

const express = require("express");
const router = express.Router();
const { createBooking, updateBooking, getMyBookings } = require("../controllers/bookingController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createBooking);
router.put("/", protect, updateBooking);
router.get("/", protect, getMyBookings); // matches our booking history requirement

module.exports = router;