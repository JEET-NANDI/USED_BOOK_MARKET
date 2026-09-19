const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
} = require("../controllers/adminOrderController");

const router = express.Router();

// Get all orders
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllOrders
);

// Get one order
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  getAdminOrderById
);

// Update order status
router.put(
  "/:id/status",
  authMiddleware,
  adminMiddleware,
  updateOrderStatus
);

module.exports = router;