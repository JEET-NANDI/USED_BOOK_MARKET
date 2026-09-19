const pool = require("../db");

// Get all orders
const getAllOrders = async (req, res) => {
  try {
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

         buyer.name AS buyer_name,
         buyer.email AS buyer_email,

         seller.id AS seller_id,
         seller.name AS seller_name,
         seller.email AS seller_email

       FROM orders o

       JOIN products p
         ON o.product_id = p.id

       JOIN users buyer
         ON o.buyer_id = buyer.id

       JOIN users seller
         ON p.seller_id = seller.id

       ORDER BY o.created_at DESC`
    );

    res.json({
      orders: result.rows,
    });
  } catch (error) {
    console.error(
      "Get all orders error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get one order by ID
const getAdminOrderById = async (
  req,
  res
) => {
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

         buyer.name AS buyer_name,
         buyer.email AS buyer_email,

         seller.id AS seller_id,
         seller.name AS seller_name,
         seller.email AS seller_email

       FROM orders o

       JOIN products p
         ON o.product_id = p.id

       JOIN users buyer
         ON o.buyer_id = buyer.id

       JOIN users seller
         ON p.seller_id = seller.id

       WHERE o.id = $1`,
      [id]
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
      "Get admin order error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Update order status
const updateOrderStatus = async (
  req,
  res
) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!status) {
      return res.status(400).json({
        message:
          "Order status is required",
      });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message:
          "Invalid order status",
      });
    }

    await client.query("BEGIN");

    const orderResult =
      await client.query(
        `SELECT
           o.id,
           o.product_id,
           o.status,
           p.seller_id,
           p.title
         FROM orders o
         JOIN products p
           ON o.product_id = p.id
         WHERE o.id = $1
         FOR UPDATE`,
        [id]
      );

    if (orderResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        message: "Order not found",
      });
    }

    const order =
      orderResult.rows[0];

    await client.query(
      `UPDATE orders
       SET status = $1
       WHERE id = $2`,
      [status, id]
    );

    // Update related shipping record
    if (status === "shipped") {
      await client.query(
        `UPDATE shipping
         SET shipping_status = 'shipped',
             shipped_at = COALESCE(
               shipped_at,
               CURRENT_TIMESTAMP
             )
         WHERE order_id = $1`,
        [id]
      );
    }

    if (status === "delivered") {
      await client.query(
        `UPDATE shipping
         SET shipping_status = 'delivered',
             delivered_at = COALESCE(
               delivered_at,
               CURRENT_TIMESTAMP
             )
         WHERE order_id = $1`,
        [id]
      );

      // Seller payout becomes payable
      await client.query(
        `UPDATE seller_payouts
         SET payout_status = 'pending'
         WHERE order_id = $1
         AND payout_status = 'processing'`,
        [id]
      );
    }

    if (status === "cancelled") {
      await client.query(
        `UPDATE shipping
         SET shipping_status = 'cancelled'
         WHERE order_id = $1`,
        [id]
      );

      await client.query(
        `UPDATE seller_payouts
         SET payout_status = 'cancelled'
         WHERE order_id = $1
         AND payout_status IN (
           'pending',
           'processing'
         )`,
        [id]
      );

      await client.query(
        `UPDATE payments
         SET payment_status = 'refunded'
         WHERE order_id = $1
         AND payment_status = 'paid'`,
        [id]
      );

      await client.query(
        `UPDATE products
         SET status = 'approved'
         WHERE id = $1`,
        [order.product_id]
      );
    }

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
        order.seller_id,
        "Order Status Updated",
        `Order #${id} for "${order.title}" is now ${status}.`,
      ]
    );

    await client.query("COMMIT");

    res.json({
      message:
        "Order status updated successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Update order status error:",
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
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus,
};