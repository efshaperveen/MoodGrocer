const asyncHandler = require("express-async-handler");
const WeeklyPlan = require("../models/weeklyPlanModel");
const { GoogleGenerativeAI, SchemaType } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generatePlan = asyncHandler(async (req, res) => {
  const { mood, preferences } = req.body;
  const userId = req.user._id;

  // JSON schema EXACTLY matching your mongoose model
  const schema = {
    type: SchemaType.OBJECT,
    properties: {
      groceries: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            item: { type: SchemaType.STRING },
            quantity: { type: SchemaType.STRING }
          }
        }
      },
      recipes: {
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.OBJECT,
          properties: {
            title: { type: SchemaType.STRING },
            ingredients: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  name: { type: SchemaType.STRING },
                  quantity: { type: SchemaType.STRING }
                }
              }
            },
            instructions: { type: SchemaType.STRING },
            mealType: {
              type: SchemaType.STRING,
              enum: ["breakfast","lunch","dinner","snack"]
            }
          }
        }
      }
    }
  };

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: schema
    }
  });

  const prompt = `
Generate a weekly diet plan matching this JSON structure exactly:
- groceries: [{ item, quantity }]
- recipes: [{ title, ingredients[{name, quantity}], instructions, mealType }]
Mood: ${mood}
Preferences: ${JSON.stringify(preferences)}
Return only pure JSON.
`;

  const result = await model.generateContent(prompt);

  const data = JSON.parse(result.response.text());

  // Save to database
  const plan = await WeeklyPlan.create({
    user: userId,
    mood,
    groceries: data.groceries,
    recipes: data.recipes,
    weekStart: new Date()
  });

  res.status(201).json(plan);
});

// ---------------- GET MY PLANS ----------------
const getMyPlans = asyncHandler(async (req, res) => {
  const plans = await WeeklyPlan.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(plans);
});

// ---------------- GET PLAN BY ID ----------------
const getPlanById = asyncHandler(async (req, res) => {
  const plan = await WeeklyPlan.findById(req.params.id);

  if (!plan) {
    res.status(404);
    throw new Error("Plan not found");
  }

  if (plan.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  res.json(plan);
});

// ---------------- DELETE PLAN ----------------
const deletePlan = asyncHandler(async (req, res) => {
  const plan = await WeeklyPlan.findById(req.params.id);

  if (!plan) {
    res.status(404);
    throw new Error("Plan not found");
  }

  if (plan.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  await plan.deleteOne();
  res.json({ message: "Plan removed" });
});

module.exports = { generatePlan, getMyPlans, getPlanById, deletePlan };


