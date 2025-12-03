// backend/src/controllers/authController.js

const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// REGISTER USER
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, state, profile } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Please fill all required fields" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      state,
      profile: profile || {}, // prevents crash
    });

    return res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (err) {
    console.error("🔥 REGISTER ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};

// LOGIN USER
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const match = await user.matchPassword(password);
    if (!match) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });

  } catch (err) {
    console.error("🔥 LOGIN ERROR:", err);
    return res.status(500).json({ error: err.message });
  }
};

// GET USER PROFILE
exports.getMe = async (req, res) => {
  return res.json(req.user);
};
