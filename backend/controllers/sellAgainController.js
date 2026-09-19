const pool = require("../db");


// Get a purchased book for "Sell Again"
const getPurchasedProductForSellAgain = async (
  req,
  res
) => {
  try {
    const { productId } = req.params;

    const result = await pool.query(
      `SELECT
         o.id AS order_id,
         o.status AS order_status,

         p.id AS product_id,
         p.title,
         p.description,
         p.category,
         p.condition,
         p.location

       FROM orders o

       JOIN products p
         ON o.product_id = p.id

       WHERE o.product_id = $1
       AND o.buyer_id = $2
       AND o.status = 'delivered'

       ORDER BY o.created_at DESC

       LIMIT 1`,
      [
        productId,
        req.user.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message:
          "You can sell again only a book that you purchased and received",
      });
    }

    res.json({
      product: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get sell again product error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Sell a previously purchased book again
const sellAgain = async (
  req,
  res
) => {
  try {
    const { productId } = req.params;

    const {
      seller_price,
      condition,
      description,
      location,
    } = req.body;

    if (
      seller_price === undefined ||
      seller_price === null ||
      seller_price === ""
    ) {
      return res.status(400).json({
        message:
          "Seller price is required",
      });
    }

    const sellerPrice =
      Number(seller_price);

    if (
      Number.isNaN(sellerPrice) ||
      sellerPrice <= 0
    ) {
      return res.status(400).json({
        message:
          "Seller price must be greater than 0",
      });
    }

    // Verify that the logged-in user
    // actually purchased and received
    // this product.
    const purchaseResult =
      await pool.query(
        `SELECT
           p.id,
           p.title,
           p.description,
           p.category,
           p.condition,
           p.location

         FROM orders o

         JOIN products p
           ON o.product_id = p.id

         WHERE o.product_id = $1
         AND o.buyer_id = $2
         AND o.status = 'delivered'

         ORDER BY o.created_at DESC

         LIMIT 1`,
        [
          productId,
          req.user.id,
        ]
      );

    if (
      purchaseResult.rows.length === 0
    ) {
      return res.status(403).json({
        message:
          "You can sell again only a book that you purchased and received",
      });
    }

    const originalProduct =
      purchaseResult.rows[0];

    // Create a completely new listing.
    // The original product remains unchanged.
    const result = await pool.query(
      `INSERT INTO products
       (
         seller_id,
         title,
         description,
         category,
         condition,
         seller_price,
         status,
         location
       )
       VALUES
       (
         $1,
         $2,
         $3,
         $4,
         $5,
         $6,
         'pending',
         $7
       )
       RETURNING *`,
      [
        req.user.id,
        originalProduct.title,
        description !== undefined
          ? description.trim()
          : originalProduct.description,
        originalProduct.category,
        condition ||
          originalProduct.condition,
        sellerPrice,
        location !== undefined
          ? location.trim()
          : originalProduct.location,
      ]
    );

    const newProduct =
      result.rows[0];

    // Notify the admin that a new
    // listing needs approval.
    const adminResult =
      await pool.query(
        `SELECT id
         FROM users
         WHERE role = 'admin'`
      );

    for (
      const admin of adminResult.rows
    ) {
      await pool.query(
        `INSERT INTO notifications
         (
           user_id,
           title,
           message
         )
         VALUES
         (
           $1,
           $2,
           $3
         )`,
        [
          admin.id,
          "New Sell Again Listing",
          `A purchased book "${originalProduct.title}" has been listed again and requires approval.`,
        ]
      );
    }

    res.status(201).json({
      message:
        "Book listed again successfully and is waiting for admin approval",
      product: newProduct,
    });
  } catch (error) {
    console.error(
      "Sell again error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  getPurchasedProductForSellAgain,
  sellAgain,
};