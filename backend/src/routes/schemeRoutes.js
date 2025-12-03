// backend/src/routes/schemeRoutes.js
import express from 'express';
import { createScheme, getAllSchemes, recommendSchemes } from '../controllers/schemeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// (optional) protect creation for admin later
router.post('/', protect, createScheme);

router.get('/', getAllSchemes);

// POST for recommendation with profile body
router.post('/recommend', recommendSchemes);

export default router;
