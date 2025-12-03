// backend/src/controllers/schemeController.js
const Scheme = require('../models/Scheme');

// Create scheme
exports.createScheme = async (req, res) => {
  try {
    const scheme = await Scheme.create(req.body);
    return res.status(201).json(scheme);
  } catch (err) {
    return res.status(500).json({ message: "Error creating scheme" });
  }
};

// Get all schemes
exports.getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find().sort({ createdAt: -1 });
    return res.json(schemes);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching schemes" });
  }
};

// Smart Recommendation (basic filter; Gemini added later)
exports.recommendSchemes = async (req, res) => {
  try {
    const { age, occupation, gender, state, category, disability, income } = req.body;

    const filters = {};

    if (state) filters.state = { $in: ["All", state] };
    if (category) filters.category = category;
    if (occupation) filters.occupation = occupation;
    if (gender) filters.gender = { $in: ["All", gender] };

    const schemes = await Scheme.find(filters);

    return res.json({
      userInput: req.body,
      matched: schemes,
      count: schemes.length
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Recommendation error" });
  }
};
