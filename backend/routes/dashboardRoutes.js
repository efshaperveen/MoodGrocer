const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  getDashboardStats,
  getRecentPlans,
  getDailyTip
} = require("../controllers/dashboardController");

const router = express.Router();

router.get("/stats", protect, getDashboardStats);
router.get("/recent", protect, getRecentPlans);
router.get("/tip", protect, getDailyTip);

module.exports = router;

