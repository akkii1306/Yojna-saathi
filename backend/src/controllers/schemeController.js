// backend/src/controllers/schemeController.js
const Scheme = require('../models/Scheme');

exports.createScheme = async (req, res) => {
  try {
    const scheme = await Scheme.create(req.body);
    return res.status(201).json(scheme);
  } catch (err) {
    console.error('Create scheme error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find().sort({ createdAt: -1 });
    return res.json(schemes);
  } catch (err) {
    console.error('Get schemes error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// simple filter based on query params (age, state, category) – placeholder
exports.recommendSchemes = async (req, res) => {
  try {
    const { state, category } = req.query;
    const query = {};

    if (state && state !== 'All') query.state = { $in: ['All', state] };
    if (category) query.category = category;

    const schemes = await Scheme.find(query);
    return res.json(schemes);
  } catch (err) {
    console.error('Recommend error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
