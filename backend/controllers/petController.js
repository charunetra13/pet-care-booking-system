// controllers/petController.js

const Pet = require("../models/Pet");

// -------------------- CREATE PET --------------------
const createPet = async (req, res) => {
  try {
    const { name, species, breed, age } = req.body;

    // Create a new pet, linking it to the logged-in user
    // req.user.id comes from our "protect" middleware (decoded from the JWT token)
    const newPet = new Pet({
      name,
      species,
      breed,
      age,
      owner: req.user.id, // we NEVER trust the frontend to send the owner ID - we take it from the verified token
    });

    await newPet.save();

    res.status(201).json({ message: "Pet added successfully", pet: newPet });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- GET ALL PETS (for logged-in user) --------------------
const getPets = async (req, res) => {
  try {
    // Only fetch pets that belong to the currently logged-in user
    const pets = await Pet.find({ owner: req.user.id });

    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- UPDATE PET --------------------
const updatePet = async (req, res) => {
  try {
    const { id } = req.params; // pet ID from the URL, e.g. /api/pet/12345

    // Find the pet first, to check ownership
    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // Security check: only the owner can update their own pet
    // pet.owner is an ObjectId, so we convert to string to compare properly
    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to update this pet" });
    }

    // Update the pet with new data from req.body
    // { new: true } makes it return the UPDATED document, not the old one
    const updatedPet = await Pet.findByIdAndUpdate(id, req.body, { new: true });

    res.status(200).json({ message: "Pet updated successfully", pet: updatedPet });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- DELETE PET --------------------
const deletePet = async (req, res) => {
  try {
    const { id } = req.params;

    const pet = await Pet.findById(id);

    if (!pet) {
      return res.status(404).json({ message: "Pet not found" });
    }

    // Security check: only the owner can delete their own pet
    if (pet.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "You are not allowed to delete this pet" });
    }

    await Pet.findByIdAndDelete(id);

    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { createPet, getPets, updatePet, deletePet };