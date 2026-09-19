const pool = require("../db");

// Get all categories
const getAllCategories = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         name,
         description,
         created_at
       FROM categories
       ORDER BY name ASC`
    );

    res.json({
      categories: result.rows,
    });
  } catch (error) {
    console.error(
      "Get all categories error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get one category
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         id,
         name,
         description,
         created_at
       FROM categories
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Category not found",
      });
    }

    res.json({
      category: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get category error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Create category
const createCategory = async (req, res) => {
  try {
    const {
      name,
      description,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message:
          "Category name is required",
      });
    }

    const categoryName =
      name.trim();

    const existingCategory =
      await pool.query(
        `SELECT id
         FROM categories
         WHERE LOWER(name) = LOWER($1)`,
        [categoryName]
      );

    if (
      existingCategory.rows.length > 0
    ) {
      return res.status(409).json({
        message:
          "Category already exists",
      });
    }

    const result = await pool.query(
      `INSERT INTO categories
       (
         name,
         description
       )
       VALUES
       ($1, $2)
       RETURNING *`,
      [
        categoryName,
        description
          ? description.trim()
          : null,
      ]
    );

    res.status(201).json({
      message:
        "Category created successfully",
      category: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Create category error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Update category
const updateCategory = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
    } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message:
          "Category name is required",
      });
    }

    const categoryName =
      name.trim();

    const existingCategory =
      await pool.query(
        `SELECT id
         FROM categories
         WHERE LOWER(name) = LOWER($1)
         AND id <> $2`,
        [
          categoryName,
          id,
        ]
      );

    if (
      existingCategory.rows.length > 0
    ) {
      return res.status(409).json({
        message:
          "Another category with this name already exists",
      });
    }

    const result = await pool.query(
      `UPDATE categories
       SET
         name = $1,
         description = $2
       WHERE id = $3
       RETURNING *`,
      [
        categoryName,
        description
          ? description.trim()
          : null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message:
          "Category not found",
      });
    }

    res.json({
      message:
        "Category updated successfully",
      category: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update category error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Delete category
const deleteCategory = async (
  req,
  res
) => {
  try {
    const { id } = req.params;

    // Check whether products use this
    // category name.
    const categoryResult =
      await pool.query(
        `SELECT name
         FROM categories
         WHERE id = $1`,
        [id]
      );

    if (
      categoryResult.rows.length === 0
    ) {
      return res.status(404).json({
        message:
          "Category not found",
      });
    }

    const categoryName =
      categoryResult.rows[0].name;

    const productResult =
      await pool.query(
        `SELECT COUNT(*) AS count
         FROM products
         WHERE LOWER(category) = LOWER($1)`,
        [categoryName]
      );

    const productCount = Number(
      productResult.rows[0].count
    );

    if (productCount > 0) {
      return res.status(400).json({
        message:
          "This category cannot be deleted because products are using it",
      });
    }

    const result = await pool.query(
      `DELETE FROM categories
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    res.json({
      message:
        "Category deleted successfully",
      category: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Delete category error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};