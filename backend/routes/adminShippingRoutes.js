const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllShipping,
  getShippingById,
  updateShipping,
} = require("../controllers/adminShippingController");

const router = express.Router();

// Get all shipping records
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllShipping
);

// Get one shipping record
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  getShippingById
);

// Update shipping information
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateShipping
);

module.exports = router;