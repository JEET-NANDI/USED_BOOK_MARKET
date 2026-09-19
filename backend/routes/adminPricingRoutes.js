const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getPricingSettings,
  updatePricingSettings,
} = require("../controllers/adminPricingController");

const router = express.Router();

// Get current pricing settings
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getPricingSettings
);

// Create or update pricing settings
router.put(
  "/",
  authMiddleware,
  adminMiddleware,
  updatePricingSettings
);

module.exports = router;