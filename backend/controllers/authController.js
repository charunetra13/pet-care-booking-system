// controllers/authController.js

const User = require("../models/User");     // our User model (blueprint)
const bcrypt = require("bcryptjs");          // for hashing (encrypting) passwords
const jwt = require("jsonwebtoken");         // for creating login tokens

// -------------------- REGISTER --------------------
const registerUser = async (req, res) => {
  try {
    // Extract data sent from frontend (in the request body)
    const { name, email, password, role } = req.body;

    // Check if a user with this email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // 400 = Bad Request (client sent invalid data)
      return res.status(400).json({ message: "User already exists with this email" });
    }

    // Hash (encrypt) the password before saving
    // "10" is the "salt rounds" - higher = more secure but slower. 10 is a good balance.
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user document using our Mongoose model
    const newUser = new User({
      name,
      email,
      password: hashedPassword, // store the HASHED password, never the plain one
      role, // "petOwner", "careProvider", or "admin"
    });

    // Save to MongoDB
    await newUser.save();

    // 201 = Created (success, new resource made)
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // 500 = Internal Server Error (something broke on our side)
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// -------------------- LOGIN --------------------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      // 401 = Unauthorized (invalid credentials)
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare the entered password with the hashed password in database
    // bcrypt.compare automatically hashes the entered password and checks if it matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create a JWT token containing the user's id and role
    // This token will be used to identify the user in future requests
    const token = jwt.sign(
      { id: user._id, role: user.role }, // payload: data stored inside the token
      process.env.JWT_SECRET,            // secret key used to sign the token (from .env)
      { expiresIn: "7d" }                // token will expire in 7 days
    );

    // Send back the token + basic user info (NEVER send the password back!)
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { registerUser, loginUser };