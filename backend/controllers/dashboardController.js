// controllers/dashboardController.js

const User = require("../models/User");
const Pet = require("../models/Pet");
const Service = require("../models/Service");
const Booking = require("../models/Booking");

const getDashboardStats = async (req, res) => {
  try {
    // Count total documents in each collection
    // countDocuments() is a Mongoose method that just counts, without fetching all the actual data (fast & efficient)
    const totalUsers = await User.countDocuments();
    const totalPetOwners = await User.countDocuments({ role: "petOwner" });
    const totalCareProviders = await User.countDocuments({ role: "careProvider" });

    const totalPets = await Pet.countDocuments();
    const totalServices = await Service.countDocuments();

    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: "pending" });
    const confirmedBookings = await Booking.countDocuments({ status: "confirmed" });
    const completedBookings = await Booking.countDocuments({ status: "completed" });
    const cancelledBookings = await Booking.countDocuments({ status: "cancelled" });

    // Send everything back as one organized object
    res.status(200).json({
      users: {
        total: totalUsers,
        petOwners: totalPetOwners,
        careProviders: totalCareProviders,
      },
      pets: {
        total: totalPets,
      },
      services: {
        total: totalServices,
      },
      bookings: {
        total: totalBookings,
        pending: pendingBookings,
        confirmed: confirmedBookings,
        completed: completedBookings,
        cancelled: cancelledBookings,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { getDashboardStats };