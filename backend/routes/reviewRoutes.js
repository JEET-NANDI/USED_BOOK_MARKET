const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getProductReviews,
  createReview,
  getMyReviews,
  deleteReview,
} = require("../controllers/reviewController");

const router = express.Router();


// Get reviews for a product
router.get(
  "/product/:productId",
  getProductReviews
);


// Get logged-in user's reviews
router.get(
  "/my",
  authMiddleware,
  getMyReviews
);


// Create a review
router.post(
  "/",
  authMiddleware,
  createReview
);


// Delete own review
router.delete(
  "/:id",
  authMiddleware,
  deleteReview
);


module.exports = router;