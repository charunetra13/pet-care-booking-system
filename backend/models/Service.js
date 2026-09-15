// models/Service.js

const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // e.g., "Dog Grooming", "Pet Sitting"
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // the Care Provider who offers this service
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Service", serviceSchema);