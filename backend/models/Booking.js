// models/Booking.js

const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet", // which pet this booking is for
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service", // which service was booked
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // who made the booking
      required: true,
    },
    date: {
      type: Date,
      required: true, // the day of the appointment
    },
    startTime: {
      type: String, // e.g., "10:00" — we use String for simplicity as beginners
      required: true,
    },
    endTime: {
      type: String, // e.g., "11:00"
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending", // every new booking starts as "pending"
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Booking", bookingSchema);