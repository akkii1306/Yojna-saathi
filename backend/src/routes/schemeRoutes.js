// backend/src/routes/schemeRoutes.js
const express = require('express');
const router = express.Router();
const {
  createScheme,
  getAllSchemes,
  recommendSchemes
} = require('../controllers/schemeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, createScheme);
router.get('/', getAllSchemes);
router.post('/recommend', protect, recommendSchemes);

module.exports = router;
