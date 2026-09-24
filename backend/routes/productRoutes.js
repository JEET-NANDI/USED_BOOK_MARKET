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

router.get(
  "/",
  getApprovedProducts
);

router.post(
  "/",
  authMiddleware,
  upload.single("bookImage"),
  createProduct
);


router.get(
  "/my",
  authMiddleware,
  getMyProducts
);


router.post(
  "/sell-again/:productId",
  authMiddleware,
  sellAgain
);


router.get(
  "/:productId/images",
  getProductImages
);


router.post(
  "/:productId/images",
  authMiddleware,
  addProductImage
);


router.delete(
  "/:productId/images/:imageId",
  authMiddleware,
  deleteProductImage
);


router.get(
  "/:id",
  getProductById
);


module.exports = router;