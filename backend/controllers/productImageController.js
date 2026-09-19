const pool = require("../db");


// Get all images for a product
const getProductImages = async (req, res) => {
  try {
    const { productId } = req.params;

    const productResult = await pool.query(
      `SELECT id
       FROM products
       WHERE id = $1`,
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const result = await pool.query(
      `SELECT
         id,
         product_id,
         image_url,
         created_at
       FROM product_images
       WHERE product_id = $1
       ORDER BY created_at ASC`,
      [productId]
    );

    res.json({
      images: result.rows,
    });
  } catch (error) {
    console.error(
      "Get product images error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Add an image to a product
const addProductImage = async (req, res) => {
  try {
    const { productId } = req.params;
    const { image_url } = req.body;

    if (!image_url || !image_url.trim()) {
      return res.status(400).json({
        message: "Image URL is required",
      });
    }

    const productResult = await pool.query(
      `SELECT
         id,
         seller_id
       FROM products
       WHERE id = $1`,
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const product = productResult.rows[0];

    // Only seller or admin can add images
    const isSeller =
      Number(product.seller_id) ===
      Number(req.user.id);

    const isAdmin =
      req.user.role === "admin";

    if (!isSeller && !isAdmin) {
      return res.status(403).json({
        message:
          "You are not allowed to add images to this book",
      });
    }

    const result = await pool.query(
      `INSERT INTO product_images
       (
         product_id,
         image_url
       )
       VALUES
       ($1, $2)
       RETURNING *`,
      [
        productId,
        image_url.trim(),
      ]
    );

    res.status(201).json({
      message:
        "Product image added successfully",
      image: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Add product image error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Delete a product image
const deleteProductImage = async (
  req,
  res
) => {
  try {
    const {
      productId,
      imageId,
    } = req.params;

    const productResult = await pool.query(
      `SELECT seller_id
       FROM products
       WHERE id = $1`,
      [productId]
    );

    if (productResult.rows.length === 0) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const product =
      productResult.rows[0];

    // Only seller or admin can delete images
    const isSeller =
      Number(product.seller_id) ===
      Number(req.user.id);

    const isAdmin =
      req.user.role === "admin";

    if (!isSeller && !isAdmin) {
      return res.status(403).json({
        message:
          "You are not allowed to delete this image",
      });
    }

    const result = await pool.query(
      `DELETE FROM product_images
       WHERE id = $1
       AND product_id = $2
       RETURNING *`,
      [
        imageId,
        productId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message:
          "Product image not found",
      });
    }

    res.json({
      message:
        "Product image deleted successfully",
      image: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Delete product image error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  getProductImages,
  addProductImage,
  deleteProductImage,
};