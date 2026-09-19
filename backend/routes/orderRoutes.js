const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
} = require("../controllers/orderController");

const router = express.Router();

// Create a new order
router.post(
  "/",
  authMiddleware,
  createOrder
);

// Get logged-in user's orders
router.get(
  "/my",
  authMiddleware,
  getMyOrders
);

// Get one order
router.get(
  "/:id",
  authMiddleware,
  getOrderById
);

// Cancel an order
router.put(
  "/:id/cancel",
  authMiddleware,
  cancelOrder
);

module.exports = router;