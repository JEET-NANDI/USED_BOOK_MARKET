const pool = require("../db");

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         id,
         name,
         email,
         role,
         created_at
       FROM users
       ORDER BY created_at DESC`
    );

    res.json({
      users: result.rows,
    });
  } catch (error) {
    console.error(
      "Get all users error:",
      error.message
    );

    res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  getAllUsers,
};