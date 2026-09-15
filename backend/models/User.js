// models/User.js

const mongoose = require("mongoose"); // import mongoose to define our schema

// A "Schema" describes the shape/structure of a document in MongoDB
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,       // must be text
      required: true,     // cannot be empty
    },
    email: {
      type: String,
      required: true,
      unique: true,       // no two users can have the same email
    },
    password: {
      type: String,
      required: true,     // we will store the ENCRYPTED password here, never plain text
    },
    role: {
      type: String,
      enum: ["petOwner", "careProvider", "admin"], // only these 3 values allowed
      default: "petOwner", // if not specified, user is a pet owner by default
    },
  },
  {
    timestamps: true, // automatically adds "createdAt" and "updatedAt" fields
  }
);

// Convert the schema into a Model called "User"
// Mongoose will create a MongoDB collection called "users" (lowercase + plural) automatically
module.exports = mongoose.model("User", userSchema);