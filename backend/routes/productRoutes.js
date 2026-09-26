const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  createProduct,
  getMyProducts,
  getApprovedProducts,
  getProductById,
} = require("../controllers/productController");

const {
  getProductImages,
  addProductImage,
  deleteProductImage,
} = require("../controllers/productImageController");

const {
  sellAgain,
} = require("../controllers/sellAgainController");

const router = express.Router();


// Get all approved books
router.get(
  "/",
  getApprovedProducts
);


// Create a new book listing
router.post(
  "/",
  authMiddleware,
  upload.fields([
    {
      name: "bookImages",
      maxCount: 2,
    },
    {
      name: "bookPdf",
      maxCount: 1,
    },
  ]),
  createProduct
);


// Get logged-in seller's products
router.get(
  "/my",
  authMiddleware,
  getMyProducts
);


// Sell a previously purchased book again
router.post(
  "/sell-again/:productId",
  authMiddleware,
  sellAgain
);


// Get product images
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


// Get one approved product
router.get(
  "/:id",
  getProductById
);


module.exports = router;