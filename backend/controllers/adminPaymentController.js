const pool = require("../db");

// Get all payments
const getAllPayments = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         p.id,
         p.order_id,
         p.amount,
         p.payment_method,
         p.payment_status,
         p.transaction_id,
         p.paid_at,
         p.created_at,

         o.buyer_id,
         o.product_id,
         o.buyer_price,
         o.status AS order_status,

         product.title AS product_title,

         buyer.name AS buyer_name,
         buyer.email AS buyer_email,

         seller.name AS seller_name,
         seller.email AS seller_email

       FROM payments p

       JOIN orders o
         ON p.order_id = o.id

       JOIN products product
         ON o.product_id = product.id

       JOIN users buyer
         ON o.buyer_id = buyer.id

       JOIN users seller
         ON product.seller_id = seller.id

       ORDER BY p.created_at DESC`
    );

    res.json({
      payments: result.rows,
    });
  } catch (error) {
    console.error(
      "Get all payments error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get one payment
const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         p.id,
         p.order_id,
         p.amount,
         p.payment_method,
         p.payment_status,
         p.transaction_id,
         p.paid_at,
         p.created_at,

         o.buyer_id,
         o.product_id,
         o.seller_price,
         o.platform_fee,
         o.buyer_price,
         o.status AS order_status,

         product.title AS product_title,

         buyer.name AS buyer_name,
         buyer.email AS buyer_email,

         seller.name AS seller_name,
         seller.email AS seller_email

       FROM payments p

       JOIN orders o
         ON p.order_id = o.id

       JOIN products product
         ON o.product_id = product.id

       JOIN users buyer
         ON o.buyer_id = buyer.id

       JOIN users seller
         ON product.seller_id = seller.id

       WHERE p.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.json({
      payment: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get payment error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Update payment status
const updatePaymentStatus = async (
  req,
  res
) => {
  try {
    const { id } = req.params;
    const {
      payment_status,
      transaction_id,
    } = req.body;

    const allowedStatuses = [
      "pending",
      "paid",
      "failed",
      "refunded",
    ];

    if (!payment_status) {
      return res.status(400).json({
        message:
          "Payment status is required",
      });
    }

    if (
      !allowedStatuses.includes(
        payment_status
      )
    ) {
      return res.status(400).json({
        message:
          "Invalid payment status",
      });
    }

    const result = await pool.query(
      `UPDATE payments
       SET
         payment_status = $1,
         transaction_id = COALESCE(
           $2,
           transaction_id
         ),
         paid_at =
           CASE
             WHEN $1 = 'paid'
             THEN COALESCE(
               paid_at,
               CURRENT_TIMESTAMP
             )
             ELSE paid_at
           END
       WHERE id = $3
       RETURNING *`,
      [
        payment_status,
        transaction_id || null,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Payment not found",
      });
    }

    res.json({
      message:
        "Payment status updated successfully",
      payment: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Update payment status error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  getAllPayments,
  getPaymentById,
  updatePaymentStatus,
};