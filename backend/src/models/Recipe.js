import mongoose from 'mongoose';

const ingredientSchema = new mongoose.Schema(
  {
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    name: { type: String, required: true },
    portion: { type: Number, default: 1 },
    unit: { type: String, default: 'serving' },
    calories: { type: Number, default: 0 },
    protein: { type: Number, default: 0 },
    carbs: { type: Number, default: 0 },
    fat: { type: Number, default: 0 },
    fiber: { type: Number, default: 0 },
  },
  { _id: false },
);

const recipeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    description: String,
    ingredients: [ingredientSchema],
    favorite: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Recipe = mongoose.model('Recipe', recipeSchema);
