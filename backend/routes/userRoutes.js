const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { getProfile } = require("../controllers/userController");

const router = express.Router();

// Test user route
router.get("/", (req, res) => {
  res.json({
    message: "User API is working",
  });
});

// Logged-in user's profile
router.get("/profile", authMiddleware, getProfile);

module.exports = router;