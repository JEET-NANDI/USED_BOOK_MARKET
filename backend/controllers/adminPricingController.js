const pool = require("../db");

// Get current pricing settings
const getPricingSettings = async (
  req,
  res
) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         fee_type,
         fee_value,
         updated_at
       FROM pricing_settings
       ORDER BY id DESC
       LIMIT 1`
    );

    res.json({
      settings:
        result.rows.length > 0
          ? result.rows[0]
          : null,
    });
  } catch (error) {
    console.error(
      "Get pricing settings error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};


// Create or update pricing settings
const updatePricingSettings = async (
  req,
  res
) => {
  const client = await pool.connect();

  try {
    const {
      fee_type,
      fee_value,
    } = req.body;

    if (
      fee_type !== "fixed" &&
      fee_type !== "percentage"
    ) {
      return res.status(400).json({
        message:
          "Fee type must be fixed or percentage",
      });
    }

    const numericFee = Number(
      fee_value
    );

    if (
      Number.isNaN(numericFee) ||
      numericFee < 0
    ) {
      return res.status(400).json({
        message:
          "Fee value must be a valid non-negative number",
      });
    }

    if (
      fee_type === "percentage" &&
      numericFee > 100
    ) {
      return res.status(400).json({
        message:
          "Percentage fee cannot be greater than 100",
      });
    }

    await client.query("BEGIN");

    const existingResult =
      await client.query(
        `SELECT id
         FROM pricing_settings
         ORDER BY id DESC
         LIMIT 1`
      );

    let result;

    if (
      existingResult.rows.length === 0
    ) {
      result = await client.query(
        `INSERT INTO pricing_settings
         (
           fee_type,
           fee_value,
           updated_at
         )
         VALUES
         ($1, $2, CURRENT_TIMESTAMP)
         RETURNING *`,
        [
          fee_type,
          numericFee,
        ]
      );
    } else {
      const settingId =
        existingResult.rows[0].id;

      result = await client.query(
        `UPDATE pricing_settings
         SET
           fee_type = $1,
           fee_value = $2,
           updated_at = CURRENT_TIMESTAMP
         WHERE id = $3
         RETURNING *`,
        [
          fee_type,
          numericFee,
          settingId,
        ]
      );
    }

    await client.query("COMMIT");

    res.json({
      message:
        "Pricing settings updated successfully",
      settings: result.rows[0],
    });
  } catch (error) {
    await client.query("ROLLBACK");

    console.error(
      "Update pricing settings error:",
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
  getPricingSettings,
  updatePricingSettings,
};