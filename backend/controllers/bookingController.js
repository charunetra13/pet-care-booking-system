// controllers/bookingController.js

const Booking = require("../models/Booking");
const Service = require("../models/Service");

// -------------------- CREATE BOOKING --------------------
const createBooking = async (req, res) => {
  try {
    const { pet, service, date, startTime, endTime } = req.body;

    // Step 1: Find the service to know WHO the provider is
    // (we need this because conflicts are checked per-provider, not per-service)
    const serviceDoc = await Service.findById(service);
    if (!serviceDoc) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Step 2: Find all EXISTING bookings for this provider, on the SAME date
    // We look through all services belonging to this provider, then find bookings for those services
    const providerServices = await Service.find({ provider: serviceDoc.provider }).select("_id");
    const providerServiceIds = providerServices.map((s) => s._id);

    const existingBookings = await Booking.find({
      service: { $in: providerServiceIds }, // any service belonging to this provider
      date: date,                            // same date
      status: { $ne: "cancelled" },          // ignore cancelled bookings - they don't block new ones
    });

    // Step 3: Check each existing booking for a time overlap with the new request
    const hasConflict = existingBookings.some((booking) => {
      // Overlap rule: (new start < existing end) AND (new end > existing start)
      return startTime < booking.endTime && endTime > booking.startTime;
    });

    if (hasConflict) {
      return res.status(409).json({ message: "This time slot is already booked. Please choose another time." });
    }

    // Step 4: No conflict found - safe to create the booking
    const newBooking = new Booking({
      pet,
      service,
      owner: req.user.id, // the logged-in Pet Owner making this booking
      date,
      startTime,
      endTime,
      status: "pending",
    });

    await newBooking.save();

    res.status(201).json({ message: "Booking created successfully", booking: newBooking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- UPDATE BOOKING (change status, e.g., confirm/cancel) --------------------
const updateBooking = async (req, res) => {
  try {
    const { id, status } = req.body; // booking ID and new status, e.g., "confirmed"

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({ message: "Booking updated successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- GET BOOKING HISTORY (for logged-in user) --------------------
const getMyBookings = async (req, res) => {
  try {
    // Find bookings made by this user, and "populate" related data so the frontend
    // doesn't need extra requests to show pet name, service name, etc.
    const bookings = await Booking.find({ owner: req.user.id })
      .populate("pet", "name species")
      .populate("service", "name price")
      .sort({ date: -1 }); // newest first

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createBooking, updateBooking, getMyBookings };