const MealPlan = require('../models/MealPlan')
const User = require('../models/User')
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/

function sumMeals(meals) {
  const totals = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
    micronutrients: { fiber: 0, sodium: 0, sugar: 0, potassium: 0 },
  }

  for (const mealType of Object.keys(meals || {})) {
    for (const item of meals[mealType] || []) {
      totals.calories += item.nutrition?.calories || 0
      totals.protein += item.nutrition?.protein || 0
      totals.carbs += item.nutrition?.carbs || 0
      totals.fats += item.nutrition?.fats || 0
      totals.micronutrients.fiber += item.nutrition?.micronutrients?.fiber || 0
      totals.micronutrients.sodium += item.nutrition?.micronutrients?.sodium || 0
      totals.micronutrients.sugar += item.nutrition?.micronutrients?.sugar || 0
      totals.micronutrients.potassium += item.nutrition?.micronutrients?.potassium || 0
    }
  }

  return totals
}

async function getDailySummary(req, res, next) {
  try {
    const date = req.query.date || new Date().toISOString().slice(0, 10)
    if (typeof date !== 'string' || !isoDatePattern.test(date)) {
      return res.status(400).json({ message: 'Invalid date format' })
    }
    const [mealPlan, user] = await Promise.all([
      MealPlan.findOne({ user: req.user.id, date }),
      User.findById(req.user.id).select('targets'),
    ])

    const intake = sumMeals(mealPlan?.meals || {})
    return res.json({
      date,
      intake,
      target: user?.targets || { calories: 2000, protein: 150, carbs: 200, fats: 67 },
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = { getDailySummary }
