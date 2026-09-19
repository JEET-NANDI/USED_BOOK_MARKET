const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
} = require("../controllers/adminPaymentController");

const router = express.Router();

// Get all payments
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllPayments
);

// Get one payment
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  getPaymentById
);

// Update payment status
router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updatePaymentStatus
);

module.exports = router;