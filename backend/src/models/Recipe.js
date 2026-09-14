const mongoose = require('mongoose')

const ingredientSchema = new mongoose.Schema(
  {
    food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
    customName: String,
    quantity: { type: Number, default: 1 },
    unit: { type: String, default: 'serving' },
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

const recipeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    description: String,
    ingredients: [ingredientSchema],
    instructions: [String],
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
    tags: [String],
  },
  { timestamps: true }
)

module.exports = mongoose.model('Recipe', recipeSchema)
