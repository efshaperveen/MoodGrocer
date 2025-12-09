const mongoose = require("mongoose");

const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [{ name: String, quantity: String }], // quantity as "2 cups", "1 tsp" etc.
  instructions: { type: String },
  mealType: { type: String, enum: ["breakfast","lunch","dinner","snack"], default: "lunch" },
});

const weeklyPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    mood: { type: String, enum: ["Tired","Happy","Stressed","Busy"], required: true },
    groceries: [{ item: String, quantity: String }],
    recipes: [recipeSchema],
    weekStart: { type: Date, default: Date.now }, // start date of plan week
  },
  { timestamps: true }
);

const WeeklyPlan = mongoose.model("WeeklyPlan", weeklyPlanSchema);
module.exports = WeeklyPlan;
