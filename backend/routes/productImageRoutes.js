const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  getProductImages,
  addProductImage,
  deleteProductImage,
} = require("../controllers/productImageController");

const router = express.Router();


// Get all images for a product
router.get(
  "/:productId/images",
  getProductImages
);


// Add product image
router.post(
  "/:productId/images",
  authMiddleware,
  addProductImage
);


// Delete product image
router.delete(
  "/:productId/images/:imageId",
  authMiddleware,
  deleteProductImage
);


module.exports = router;