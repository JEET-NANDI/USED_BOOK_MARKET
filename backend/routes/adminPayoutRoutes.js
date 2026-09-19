const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllPayouts,
  getPayoutById,
  updatePayoutStatus,
} = require("../controllers/adminPayoutController");

const router = express.Router();

// Get all seller payouts
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllPayouts
);

// Get one payout
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  getPayoutById
);

// Update payout status
router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updatePayoutStatus
);

module.exports = router;