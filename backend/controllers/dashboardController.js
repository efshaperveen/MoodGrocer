const asyncHandler = require("express-async-handler");
const WeeklyPlan = require("../models/weeklyPlanModel");

// ----------------- DASHBOARD STATS -----------------
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const totalPlans = await WeeklyPlan.countDocuments({ user: userId });

  const lastPlan = await WeeklyPlan.findOne({ user: userId })
    .sort({ createdAt: -1 });

  const accountAgeDays = Math.floor(
    (Date.now() - req.user.createdAt) / (1000 * 60 * 60 * 24)
  );

  const allPlans = await WeeklyPlan.find({ user: userId });

  // Mood count
  const moodCount = {};
  allPlans.forEach(p => {
    moodCount[p.mood] = (moodCount[p.mood] || 0) + 1;
  });

  const mostUsedMood =
    Object.keys(moodCount).length > 0
      ? Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0][0]
      : "";

  const totalRecipes = allPlans.reduce((sum, plan) => sum + plan.recipes.length, 0);

  res.json({
    totalPlans,
    lastPlanDate: lastPlan?.createdAt || null,
    accountAge: accountAgeDays,       // FIXED
    mostUsedMood,
    totalRecipes,
  });
});

// ----------------- RECENT PLANS -----------------
const getRecentPlans = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const plans = await WeeklyPlan.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(3);

  const formatted = plans.map((p) => ({
    id: p._id,                               
    mood: p.mood,
    recipesCount: p.recipes.length,
    date: p.createdAt,
  }));

  res.json(formatted);
});

// ----------------- TIP OF THE DAY -----------------
const getDailyTip = asyncHandler(async (req, res) => {
  const tips = [
    "Drink at least 2–3 liters of water daily.",
    "Add more protein to stay full longer.",
    "Do not skip breakfast — your body needs morning fuel.",
    "Add at least one fruit to your daily meals.",
    "Avoid heavy meals after 9 PM for better sleep.",
    "Try 10 minutes of walking after meals.",
    "Plan meals ahead to avoid junk food cravings.",
  ];

  const index = new Date().getDate() % tips.length;

  res.json({ tip: tips[index] });
});

module.exports = {
  getDashboardStats,
  getRecentPlans,
  getDailyTip,
};


