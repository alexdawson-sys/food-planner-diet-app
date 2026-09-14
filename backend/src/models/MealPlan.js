import mongoose from 'mongoose';

const plannedItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    portion: { type: Number, default: 1 },
    unit: { type: String, default: 'serving' },
    category: { type: String, default: 'General' },
    estimatedCost: { type: Number, default: 0 },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
  },
  { _id: false },
);

const dayPlanSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    meals: {
      breakfast: { type: [plannedItemSchema], default: [] },
      lunch: { type: [plannedItemSchema], default: [] },
      dinner: { type: [plannedItemSchema], default: [] },
      snack: { type: [plannedItemSchema], default: [] },
    },
  },
  { _id: false },
);

const mealPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    weekStart: { type: String, required: true, index: true },
    preset: { type: String, default: 'balanced' },
    templateName: String,
    days: [dayPlanSchema],
  },
  { timestamps: true },
);

mealPlanSchema.index({ user: 1, weekStart: 1 }, { unique: true });

export const MealPlan = mongoose.model('MealPlan', mealPlanSchema);
