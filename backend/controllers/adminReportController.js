const pool = require("../db");

// Get all reports
const getAllReports = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         r.id,
         r.reporter_id,
         r.product_id,
         r.reason,
         r.description,
         r.status,
         r.created_at,

         reporter.name AS reporter_name,
         reporter.email AS reporter_email,

         p.title AS product_title,
         p.status AS product_status,

         seller.name AS seller_name,
         seller.email AS seller_email

       FROM reports r

       JOIN users reporter
         ON r.reporter_id = reporter.id

       LEFT JOIN products p
         ON r.product_id = p.id

       LEFT JOIN users seller
         ON p.seller_id = seller.id

       ORDER BY r.created_at DESC`
    );

    res.json({
      reports: result.rows,
    });
  } catch (error) {
    console.error(
      "Get all reports error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Get one report
const getReportById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT
         r.id,
         r.reporter_id,
         r.product_id,
         r.reason,
         r.description,
         r.status,
         r.created_at,

         reporter.name AS reporter_name,
         reporter.email AS reporter_email,

         p.title AS product_title,
         p.description AS product_description,
         p.status AS product_status,
         p.seller_id,

         seller.name AS seller_name,
         seller.email AS seller_email

       FROM reports r

       JOIN users reporter
         ON r.reporter_id = reporter.id

       LEFT JOIN products p
         ON r.product_id = p.id

       LEFT JOIN users seller
         ON p.seller_id = seller.id

       WHERE r.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    res.json({
      report: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Get report error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Update report status
const updateReportStatus = async (
  req,
  res
) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "reviewing",
      "resolved",
      "rejected",
    ];

    if (!status) {
      return res.status(400).json({
        message:
          "Report status is required",
      });
    }

    if (
      !allowedStatuses.includes(status)
    ) {
      return res.status(400).json({
        message:
          "Invalid report status",
      });
    }

    await client.query("BEGIN");

    const reportResult =
      await client.query(
        `SELECT
           r.id,
           r.reporter_id,
           r.product_id,
           r.reason,
           p.title AS product_title,
           p.seller_id
         FROM reports r

         LEFT JOIN products p
           ON r.product_id = p.id

         WHERE r.id = $1
         FOR UPDATE`,
        [id]
      );

    if (reportResult.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        message: "Report not found",
      });
    }

    const report =
      reportResult.rows[0];

    const result = await client.query(
      `UPDATE reports
       SET status = $1
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    // Notify the person who submitted
    // the report.
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
        report.reporter_id,
        "Report Status Updated",
        `Your report #${id} is now ${status}.`,
      ]
    );

    // If a report is resolved against
    // a product, notify the seller.
    if (
      status === "resolved" &&
      report.seller_id
    ) {
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
          report.seller_id,
          "Product Report Resolved",
          `A report concerning "${report.product_title || "your product"}" has been resolved by the administrator.`,
        ]
      );
    }

    await client.query("COMMIT");

    res.json({
      message:
        "Report status updated successfully",
      report: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Update report status error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  } finally {
    client.release();
  }
};


// Delete a report
const deleteReport = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `DELETE FROM reports
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Report not found",
      });
    }

    res.json({
      message:
        "Report deleted successfully",
      report: result.rows[0],
    });
  } catch (error) {
    console.error(
      "Delete report error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


module.exports = {
  getAllReports,
  getReportById,
  updateReportStatus,
  deleteReport,
};