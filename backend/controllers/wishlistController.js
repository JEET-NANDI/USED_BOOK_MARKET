const pool = require("../db");

// Get logged-in user's wishlist
const getWishlist = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         w.id,
         w.product_id,
         w.created_at,

         p.title AS product_title,
         p.description,
         p.category,
         p.condition,
         p.seller_price,
         p.status,
         p.location,

         seller.name AS seller_name,
         seller.email AS seller_email,

         (
           SELECT pi.image_url
           FROM product_images pi
           WHERE pi.product_id = p.id
           ORDER BY pi.id ASC
           LIMIT 1
         ) AS image_url

       FROM wishlist w

       JOIN products p
         ON w.product_id = p.id

       JOIN users seller
         ON p.seller_id = seller.id

       WHERE w.user_id = $1

       ORDER BY w.created_at DESC`,
      [req.user.id]
    );

    const wishlist = result.rows.map(
      (item) => ({
        ...item,
        seller_price: Number(
          item.seller_price
        ),
        buyer_price: Number(
          item.seller_price
        ),
      })
    );

    res.json({
      wishlist,
    });
  } catch (error) {
    console.error(
      "Get wishlist error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Add product to wishlist
const addToWishlist = async (
  req,
  res
) => {
  try {
    const { product_id } = req.body;

    if (!product_id) {
      return res.status(400).json({
        message:
          "Product ID is required",
      });
    }

    // Product must exist and be approved
    const productResult =
      await pool.query(
        `SELECT
           id,
           seller_id,
           title,
           status
         FROM products
         WHERE id = $1`,
        [product_id]
      );

    if (
      productResult.rows.length === 0
    ) {
      return res.status(404).json({
        message: "Book not found",
      });
    }

    const product =
      productResult.rows[0];

    if (product.status !== "approved") {
      return res.status(400).json({
        message:
          "Only approved books can be added to wishlist",
      });
    }

    // Seller cannot wishlist own listing
    if (
      Number(product.seller_id) ===
      Number(req.user.id)
    ) {
      return res.status(400).json({
        message:
          "You cannot add your own listing to wishlist",
      });
    }

    const result = await pool.query(
      `INSERT INTO wishlist
       (
         user_id,
         product_id
       )
       VALUES
       ($1, $2)
       ON CONFLICT
       (
         user_id,
         product_id
       )
       DO NOTHING
       RETURNING *`,
      [
        req.user.id,
        product_id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(409).json({
        message:
          "Book is already in your wishlist",
      });
    }

    res.status(201).json({
      message:
        "Book added to wishlist",
      wishlistItem:
        result.rows[0],
    });
  } catch (error) {
    console.error(
      "Add wishlist error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Remove product from wishlist
const removeFromWishlist = async (
  req,
  res
) => {
  try {
    const { productId } =
      req.params;

    const result = await pool.query(
      `DELETE FROM wishlist
       WHERE user_id = $1
       AND product_id = $2
       RETURNING *`,
      [
        req.user.id,
        productId,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message:
          "Book is not in your wishlist",
      });
    }

    res.json({
      message:
        "Book removed from wishlist",
    });
  } catch (error) {
    console.error(
      "Remove wishlist error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Check whether product is in wishlist
const checkWishlist = async (
  req,
  res
) => {
  try {
    const { productId } =
      req.params;

    const result = await pool.query(
      `SELECT id
       FROM wishlist
       WHERE user_id = $1
       AND product_id = $2`,
      [
        req.user.id,
        productId,
      ]
    );

    res.json({
      inWishlist:
        result.rows.length > 0,
    });
  } catch (error) {
    console.error(
      "Check wishlist error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlist,
};