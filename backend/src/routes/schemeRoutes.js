// backend/src/routes/schemeRoutes.js
const express = require("express");
const router = express.Router();
const {
  createScheme,
  getAllSchemes,
  recommendSchemes,
} = require("../controllers/schemeController");
const { protect } = require("../middleware/authMiddleware");

// (optional) protect creation for admin later
router.post("/", protect, createScheme);
router.get("/", getAllSchemes);

// POST for recommendation with profile body
router.post("/recommend", recommendSchemes);

module.exports = router;
