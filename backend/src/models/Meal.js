import mongoose from 'mongoose';

const mealEntrySchema = new mongoose.Schema(
  {
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
    name: { type: String, required: true },
    portion: { type: Number, default: 1 },
    unit: { type: String, default: 'serving' },
    category: { type: String, default: 'General' },
    estimatedCost: { type: Number, default: 0 },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
  },
  { _id: false },
);

const mealSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true, default: Date.now, index: true },
    type: { type: String, enum: ['breakfast', 'lunch', 'dinner', 'snack'], required: true },
    foods: [mealEntrySchema],
    totals: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fat: { type: Number, default: 0 },
      fiber: { type: Number, default: 0 },
    },
    notes: String,
  },
  { timestamps: true },
);

export const Meal = mongoose.model('Meal', mealSchema);
