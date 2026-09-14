const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    servingSize: { type: String, default: '100g' },
    calories: { type: Number, required: true },
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
  { timestamps: true }
)

module.exports = mongoose.model('Food', foodSchema)
