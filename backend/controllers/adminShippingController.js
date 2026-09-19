const pool = require("../db");

// Get all shipping records
const getAllShipping = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         s.id,
         s.order_id,
         s.tracking_number,
         s.courier_name,
         s.shipping_status,
         s.shipped_at,
         s.delivered_at,
         s.created_at,

         o.buyer_id,
         o.product_id,
         o.buyer_price,
         o.status AS order_status,

         p.title AS product_title,

         buyer.name AS buyer_name,
         buyer.email AS buyer_email,

         seller.name AS seller_name,
         seller.email AS seller_email

       FROM shipping s

       JOIN orders o
         ON s.order_id = o.id

       JOIN products p
         ON o.product_id = p.id

       JOIN users buyer
         ON o.buyer_id = buyer.id

       JOIN users seller
         ON p.seller_id = seller.id

       ORDER BY s.created_at DESC`
    );

    res.json({
      shipping: result.rows,
    });
  } catch (error) {
    console.error(
      "Get all shipping error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get one shipping record
const getShippingById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         s.id,
         s.order_id,
         s.tracking_number,
         s.courier_name,
         s.shipping_status,
         s.shipped_at,
         s.delivered_at,
         s.created_at,

         o.buyer_id,
         o.product_id,
         o.buyer_price,
         o.status AS order_status,

         p.title AS product_title,

         buyer.name AS buyer_name,
         buyer.email AS buyer_email,

         seller.name AS seller_name,
         seller.email AS seller_email

       FROM shipping s

       JOIN orders o
         ON s.order_id = o.id

       JOIN products p
         ON o.product_id = p.id

       JOIN users buyer
         ON o.buyer_id = buyer.id

       JOIN users seller
         ON p.seller_id = seller.id

       WHERE s.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Shipping record not found",
      });
    }

    res.json({
      shipping: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get shipping error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Update shipping information
const updateShipping = async (req, res) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    const {
      tracking_number,
      courier_name,
      shipping_status,
    } = req.body;

    const allowedStatuses = [
      "pending",
      "shipped",
      "in_transit",
      "delivered",
      "cancelled",
    ];

    if (
      shipping_status &&
      !allowedStatuses.includes(
        shipping_status
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid shipping status",
      });
    }

    await client.query("BEGIN");

    const shippingResult =
      await client.query(
        `SELECT
           id,
           order_id,
           shipping_status
         FROM shipping
         WHERE id = $1
         FOR UPDATE`,
        [id]
      );

    if (shippingResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        message:
          "Shipping record not found",
      });
    }

    const shipping =
      shippingResult.rows[0];

    const newStatus =
      shipping_status ||
      shipping.shipping_status;

    const result = await client.query(
      `UPDATE shipping
       SET
         tracking_number = COALESCE(
           $1,
           tracking_number
         ),
         courier_name = COALESCE(
           $2,
           courier_name
         ),
         shipping_status = $3,

         shipped_at =
           CASE
             WHEN $3 IN (
               'shipped',
               'in_transit',
               'delivered'
             )
             THEN COALESCE(
               shipped_at,
               CURRENT_TIMESTAMP
             )
             ELSE shipped_at
           END,

         delivered_at =
           CASE
             WHEN $3 = 'delivered'
             THEN COALESCE(
               delivered_at,
               CURRENT_TIMESTAMP
             )
             ELSE delivered_at
           END

       WHERE id = $4

       RETURNING *`,
      [
        tracking_number || null,
        courier_name || null,
        newStatus,
        id,
      ]
    );

    // Keep order status synchronized
    if (newStatus === "shipped") {
      await client.query(
        `UPDATE orders
         SET status = 'shipped'
         WHERE id = $1`,
        [shipping.order_id]
      );
    }

    if (newStatus === "in_transit") {
      await client.query(
        `UPDATE orders
         SET status = 'shipped'
         WHERE id = $1
         AND status NOT IN (
           'delivered',
           'cancelled'
         )`,
        [shipping.order_id]
      );
    }

    if (newStatus === "delivered") {
      await client.query(
        `UPDATE orders
         SET status = 'delivered'
         WHERE id = $1`,
        [shipping.order_id]
      );
    }

    if (newStatus === "cancelled") {
      await client.query(
        `UPDATE orders
         SET status = 'cancelled'
         WHERE id = $1`,
        [shipping.order_id]
      );

      await client.query(
        `UPDATE seller_payouts
         SET payout_status = 'cancelled'
         WHERE order_id = $1
         AND payout_status IN (
           'pending',
           'processing'
         )`,
        [shipping.order_id]
      );
    }

    await client.query("COMMIT");

    res.json({
      message:
        "Shipping information updated successfully",
      shipping: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Update shipping error:",
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
  getAllShipping,
  getShippingById,
  updateShipping,
};