import { Meal } from '../models/Meal.js';
import { Weight } from '../models/Weight.js';
import { rangeMealsByDays } from '../utils/nutrition.js';

function aggregateMeals(meals) {
  return meals.reduce(
    (totals, meal) => ({
      calories: totals.calories + (meal.totals?.calories || 0),
      protein: totals.protein + (meal.totals?.protein || 0),
      carbs: totals.carbs + (meal.totals?.carbs || 0),
      fat: totals.fat + (meal.totals?.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

async function analyticsWindow(userId, days) {
  const meals = rangeMealsByDays(await Meal.find({ user: userId }).sort({ date: 1 }), days);
  const weights = await Weight.find({ user: userId }).sort({ date: 1 }).limit(days * 2);
  return { meals, weights, totals: aggregateMeals(meals) };
}

export async function getDailyAnalytics(req, res, next) {
  try {
    return res.json(await analyticsWindow(req.user.id, 1));
  } catch (error) {
    return next(error);
  }
}

export async function getWeeklyAnalytics(req, res, next) {
  try {
    return res.json(await analyticsWindow(req.user.id, 7));
  } catch (error) {
    return next(error);
  }
}

export async function getMonthlyAnalytics(req, res, next) {
  try {
    return res.json(await analyticsWindow(req.user.id, 30));
  } catch (error) {
    return next(error);
  }
}
