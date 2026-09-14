const mongoose = require('mongoose')

const mealItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    servings: { type: Number, default: 1 },
    nutrition: {
      calories: { type: Number, default: 0 },
      protein: { type: Number, default: 0 },
      carbs: { type: Number, default: 0 },
      fats: { type: Number, default: 0 },
    },
  },
  { _id: false }
)

const templateDaySchema = new mongoose.Schema(
  {
    dayOfWeek: { type: Number, min: 0, max: 6, required: true },
    meals: {
      breakfast: { type: [mealItemSchema], default: [] },
      lunch: { type: [mealItemSchema], default: [] },
      dinner: { type: [mealItemSchema], default: [] },
      snacks: { type: [mealItemSchema], default: [] },
    },
  },
  { _id: false }
)

const mealTemplateSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    days: { type: [templateDaySchema], default: [] },
  },
  { timestamps: true }
)

module.exports = mongoose.model('MealTemplate', mealTemplateSchema)
