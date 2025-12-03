// backend/src/routes/schemeRoutes.js
const express = require('express');
const router = express.Router();
const {
  createScheme,
  getAllSchemes,
  recommendSchemes,
} = require('../controllers/schemeController');
const { protect } = require('../middleware/authMiddleware');

// admin-only in future, for now just protected add:
router.post('/', protect, createScheme);
router.get('/', getAllSchemes);
router.get('/recommend', recommendSchemes);

module.exports = router;
