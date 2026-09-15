// controllers/serviceController.js

const Service = require("../models/Service");

// -------------------- CREATE SERVICE --------------------
const createService = async (req, res) => {
  try {
    const { name, description, price } = req.body;

    // Link this service to the logged-in Care Provider
    const newService = new Service({
      name,
      description,
      price,
      provider: req.user.id, // taken from the verified JWT token, not from req.body
    });

    await newService.save();

    res.status(201).json({ message: "Service added successfully", service: newService });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- GET ALL SERVICES --------------------
const getServices = async (req, res) => {
  try {
    // Unlike pets, we show ALL services to everyone (Pet Owners need to browse and pick one to book)
    // .populate("provider", "name email") replaces the provider ID with actual provider details (just name + email)
    const services = await Service.find().populate("provider", "name email");

    res.status(200).json(services);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- UPDATE SERVICE --------------------
const updateService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    // Only the provider who created this service can update it
    if (service.provider.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to update this service" });
    }

    const updatedService = await Service.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json({ message: "Service updated successfully", service: updatedService });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- DELETE SERVICE --------------------
const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findById(id);

    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    if (service.provider.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to delete this service" });
    }

    await Service.findByIdAndDelete(id);

    res.status(200).json({ message: "Service deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createService, getServices, updateService, deleteService };
