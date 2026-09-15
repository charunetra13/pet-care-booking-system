// server.js

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Import our auth routes
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const petRoutes = require("./routes/petRoutes");
app.use("/api/pet", petRoutes);

const serviceRoutes = require("./routes/serviceRoutes");
app.use("/api/service", serviceRoutes);

const bookingRoutes = require("./routes/bookingRoutes");
app.use("/api/booking", bookingRoutes);

const dashboardRoutes = require("./routes/dashboardRoutes");
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("Pet Care Booking System API is running...");
});

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});