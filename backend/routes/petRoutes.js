// routes/petRoutes.js

const express = require("express");
const router = express.Router();
const { createPet, getPets, updatePet, deletePet } = require("../controllers/petController");
const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createPet);
router.get("/", protect, getPets);
router.put("/:id", protect, updatePet);
router.delete("/:id", protect, deletePet);

module.exports = router;