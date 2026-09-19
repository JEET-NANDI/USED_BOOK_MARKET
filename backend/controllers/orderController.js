const pool = require("../db");

// Create a new order
const createOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const {
      product_id,
      delivery_address,
      payment_method,
    } = req.body;

    if (!product_id || !delivery_address) {
      return res.status(400).json({
        message:
          "Product and delivery address are required",
      });
    }

    await client.query("BEGIN");

    // Get the approved product
    const productResult = await client.query(
      `SELECT
         p.id,
         p.seller_id,
         p.title,
         p.seller_price,
         p.status
       FROM products p
       WHERE p.id = $1
       FOR UPDATE`,
      [product_id]
    );

    if (productResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        message: "Book not found",
      });
    }

    const product = productResult.rows[0];

    // Only approved books can be purchased
    if (product.status !== "approved") {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message:
          "This book is not available for purchase",
      });
    }

    // Seller cannot buy their own book
    if (
      Number(product.seller_id) ===
      Number(req.user.id)
    ) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message:
          "You cannot purchase your own listing",
      });
    }

    // Prevent purchasing an already ordered book
    const existingOrderResult =
      await client.query(
        `SELECT id
         FROM orders
         WHERE product_id = $1
         AND status NOT IN ('cancelled')
         LIMIT 1`,
        [product_id]
      );

    if (existingOrderResult.rows.length > 0) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message:
          "This book has already been ordered",
      });
    }

    const sellerPrice = Number(
      product.seller_price
    );

    // Get current platform pricing
    const pricingResult =
      await client.query(
        `SELECT
           fee_type,
           fee_value
         FROM pricing_settings
         ORDER BY id DESC
         LIMIT 1`
      );

    let platformFee = 0;

    if (pricingResult.rows.length > 0) {
      const pricing =
        pricingResult.rows[0];

      const feeValue = Number(
        pricing.fee_value
      );

      if (pricing.fee_type === "percentage") {
        platformFee =
          (sellerPrice * feeValue) / 100;
      } else {
        platformFee = feeValue;
      }
    }

    const buyerPrice =
      sellerPrice + platformFee;

    // Create order
    const orderResult =
      await client.query(
        `INSERT INTO orders
         (
           buyer_id,
           product_id,
           seller_price,
           platform_fee,
           buyer_price,
           status,
           delivery_address
         )
         VALUES
         ($1, $2, $3, $4, $5, 'pending', $6)
         RETURNING *`,
        [
          req.user.id,
          product_id,
          sellerPrice,
          platformFee,
          buyerPrice,
          delivery_address.trim(),
        ]
      );

    const order = orderResult.rows[0];

    // Create payment record
    await client.query(
      `INSERT INTO payments
       (
         order_id,
         amount,
         payment_method,
         payment_status
       )
       VALUES
       ($1, $2, $3, 'pending')`,
      [
        order.id,
        buyerPrice,
        payment_method ||
          "Cash on Delivery",
      ]
    );

    // Create shipping record
    await client.query(
      `INSERT INTO shipping
       (
         order_id,
         shipping_status
       )
       VALUES
       ($1, 'pending')`,
      [order.id]
    );

    // Create seller payout record
    await client.query(
      `INSERT INTO seller_payouts
       (
         order_id,
         seller_id,
         amount,
         payout_status
       )
       VALUES
       ($1, $2, $3, 'pending')`,
      [
        order.id,
        product.seller_id,
        sellerPrice,
      ]
    );

    // Mark product as sold
    await client.query(
      `UPDATE products
       SET status = 'sold'
       WHERE id = $1`,
      [product_id]
    );

    // Notify seller
    await client.query(
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
        product.seller_id,
        "New Book Order",
        `Your book "${product.title}" has been ordered.`,
      ]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message:
        "Order placed successfully",
      order,
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Create order error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  } finally {
    client.release();
  }
};


// Get logged-in buyer's orders
const getMyOrders = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         o.id,
         o.product_id,
         o.seller_price,
         o.platform_fee,
         o.buyer_price,
         o.status,
         o.delivery_address,
         o.created_at,

         p.title AS product_title,
         p.category,
         p.condition,

         u.id AS seller_id,
         u.name AS seller_name,
         u.email AS seller_email

       FROM orders o

       JOIN products p
         ON o.product_id = p.id

       JOIN users u
         ON p.seller_id = u.id

       WHERE o.buyer_id = $1

       ORDER BY o.created_at DESC`,
      [req.user.id]
    );

    res.json({
      orders: result.rows,
    });
  } catch (error) {
    console.error(
      "Get my orders error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get one order
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         o.id,
         o.buyer_id,
         o.product_id,
         o.seller_price,
         o.platform_fee,
         o.buyer_price,
         o.status,
         o.delivery_address,
         o.created_at,

         p.title AS product_title,
         p.category,
         p.condition,

         u.id AS seller_id,
         u.name AS seller_name,
         u.email AS seller_email

       FROM orders o

       JOIN products p
         ON o.product_id = p.id

       JOIN users u
         ON p.seller_id = u.id

       WHERE o.id = $1
       AND o.buyer_id = $2`,
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    res.json({
      order: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get order error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Cancel an order
const cancelOrder = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query("BEGIN");

    const orderResult =
      await client.query(
        `SELECT
           o.id,
           o.product_id,
           o.status,
           p.title
         FROM orders o
         JOIN products p
           ON o.product_id = p.id
         WHERE o.id = $1
         AND o.buyer_id = $2
         FOR UPDATE`,
        [id, req.user.id]
      );

    if (orderResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        message: "Order not found",
      });
    }

    const order =
      orderResult.rows[0];

    if (
      order.status === "shipped" ||
      order.status === "delivered"
    ) {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message:
          "This order cannot be cancelled",
      });
    }

    if (order.status === "cancelled") {
      await client.query("ROLLBACK");

      return res.status(400).json({
        message:
          "Order is already cancelled",
      });
    }

    await client.query(
      `UPDATE orders
       SET status = 'cancelled'
       WHERE id = $1`,
      [id]
    );

    await client.query(
      `UPDATE products
       SET status = 'approved'
       WHERE id = $1`,
      [order.product_id]
    );

    await client.query(
      `UPDATE payments
       SET payment_status = 'refunded'
       WHERE order_id = $1
       AND payment_status = 'paid'`,
      [id]
    );

    await client.query(
      `UPDATE seller_payouts
       SET payout_status = 'cancelled'
       WHERE order_id = $1
       AND payout_status = 'pending'`,
      [id]
    );

    await client.query(
      `UPDATE shipping
       SET shipping_status = 'cancelled'
       WHERE order_id = $1`,
      [id]
    );

    await client.query("COMMIT");

    res.json({
      message:
        "Order cancelled successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Cancel order error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  } finally {
    client.release();
  }
};


module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
};