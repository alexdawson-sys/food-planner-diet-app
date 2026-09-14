const mongoose = require('mongoose')

const mealItemSchema = new mongoose.Schema(
  {
    recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' },
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    name: { type: String, required: true },
    servings: { type: Number, default: 1 },
    nutrition: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fats: { type: Number, default: 0 },
      micronutrients: {
        fiber: { type: Number, default: 0 },
        sodium: { type: Number, default: 0 },
        sugar: { type: Number, default: 0 },
        potassium: { type: Number, default: 0 },
      },
    },
  },
  { _id: false }
)

const mealContainer = {
  breakfast: { type: [mealItemSchema], default: [] },
  lunch: { type: [mealItemSchema], default: [] },
  dinner: { type: [mealItemSchema], default: [] },
  snacks: { type: [mealItemSchema], default: [] },
}

const mealPlanSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    meals: mealContainer,
  },
  { timestamps: true }
)
mealPlanSchema.index({ user: 1, date: 1 }, { unique: true })

module.exports = mongoose.model('MealPlan', mealPlanSchema)
