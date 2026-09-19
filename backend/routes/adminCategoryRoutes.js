const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/adminCategoryController");

const router = express.Router();

// Get all categories
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllCategories
);

// Get one category
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  getCategoryById
);

// Create category
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createCategory
);

// Update category
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateCategory
);

// Delete category
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteCategory
);

module.exports = router;