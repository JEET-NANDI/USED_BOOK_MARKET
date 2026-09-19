const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  getAllReports,
  getReportById,
  updateReportStatus,
  deleteReport,
} = require("../controllers/adminReportController");

const router = express.Router();

// Get all reports
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllReports
);

// Get one report
router.get(
  "/:id",
  authMiddleware,
  adminMiddleware,
  getReportById
);

// Update report status
router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  updateReportStatus
);

// Delete report
router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteReport
);

module.exports = router;