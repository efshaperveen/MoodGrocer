const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { body } = require("express-validator");
const validateRequest = require("../middleware/validateRequest");
const { generatePlan, getMyPlans, getPlanById, deletePlan } = require("../controllers/planController");

router.post(
  "/generate",
  protect,
  [
    body("mood").isString().notEmpty(),
    body("preferences").optional().isObject()
  ],
  validateRequest,
  generatePlan
);
router.get("/my", protect, getMyPlans);
router.get("/:id", protect, getPlanById);
router.delete("/:id", protect, deletePlan);

module.exports = router;
