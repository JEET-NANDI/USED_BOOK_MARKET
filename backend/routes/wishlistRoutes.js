const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
} = require("../controllers/wishlistController");

const router = express.Router();

// Get logged-in user's wishlist
router.get(
  "/",
  authMiddleware,
  getWishlist
);

// Add book to wishlist
router.post(
  "/",
  authMiddleware,
  addToWishlist
);

// Check wishlist status
router.get(
  "/:productId/check",
  authMiddleware,
  checkWishlist
);

// Remove book from wishlist
router.delete(
  "/:productId",
  authMiddleware,
  removeFromWishlist
);

module.exports = router;