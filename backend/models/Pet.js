// models/Pet.js

const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // every pet must have a name
    },
    species: {
      type: String,
      required: true, // e.g., Dog, Cat, Bird
    },
    breed: {
      type: String, // optional, e.g., "Labrador"
    },
    age: {
      type: Number, // pet's age in years
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId, // stores the ID of the User who owns this pet
      ref: "User", // tells Mongoose this ID refers to a document in the "User" collection
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Pet", petSchema);