import { MealPlan } from '../models/MealPlan.js';
import { ShoppingList } from '../models/ShoppingList.js';
import { buildShoppingList, startOfWeek } from '../utils/nutrition.js';

function normalizeWeek(value) {
  return new Date(value || startOfWeek()).toISOString().split('T')[0];
}

function normalizeMealItem(item = {}) {
  return {
    name: typeof item.name === 'string' ? item.name.trim() : 'Planned item',
    portion: Number.isFinite(Number(item.portion)) ? Number(item.portion) : 1,
    unit: typeof item.unit === 'string' ? item.unit.trim() : 'serving',
    category: typeof item.category === 'string' ? item.category.trim() : 'General',
    estimatedCost: Number.isFinite(Number(item.estimatedCost)) ? Number(item.estimatedCost) : 0,
    calories: Number.isFinite(Number(item.calories)) ? Number(item.calories) : 0,
    protein: Number.isFinite(Number(item.protein)) ? Number(item.protein) : 0,
    carbs: Number.isFinite(Number(item.carbs)) ? Number(item.carbs) : 0,
    fat: Number.isFinite(Number(item.fat)) ? Number(item.fat) : 0,
  };
}

function normalizeDayPlan(day = {}) {
  return {
    date: new Date(day.date || new Date()).toISOString(),
    meals: {
      breakfast: Array.isArray(day.meals?.breakfast) ? day.meals.breakfast.map(normalizeMealItem) : [],
      lunch: Array.isArray(day.meals?.lunch) ? day.meals.lunch.map(normalizeMealItem) : [],
      dinner: Array.isArray(day.meals?.dinner) ? day.meals.dinner.map(normalizeMealItem) : [],
      snack: Array.isArray(day.meals?.snack) ? day.meals.snack.map(normalizeMealItem) : [],
    },
  };
}

export async function saveMealPlan(req, res, next) {
  try {
    const weekStart = normalizeWeek(req.body.weekStart);
    const payload = {
      user: req.user.id,
      weekStart,
      preset: typeof req.body.preset === 'string' ? req.body.preset.trim() : 'balanced',
      templateName: typeof req.body.templateName === 'string' ? req.body.templateName.trim() : undefined,
      days: Array.isArray(req.body.days) ? req.body.days.map(normalizeDayPlan) : [],
    };
    const plan = await MealPlan.findOneAndUpdate(
      { user: req.user.id, weekStart },
      { $set: payload },
      { upsert: true, new: true, runValidators: true },
    );

    const items = buildShoppingList(plan.days);
    await ShoppingList.findOneAndUpdate(
      { user: req.user.id, weekStart },
      { user: req.user.id, weekStart, items },
      { upsert: true, new: true, runValidators: true },
    );

    return res.status(201).json(plan);
  } catch (error) {
    return next(error);
  }
}

export async function getMealPlan(req, res, next) {
  try {
    const weekStart = normalizeWeek(req.params.week);
    const plan = await MealPlan.findOne({ user: req.user.id, weekStart });
    return res.json(plan);
  } catch (error) {
    return next(error);
  }
}

export async function getShoppingList(req, res, next) {
  try {
    const weekStart = normalizeWeek(req.params.week);
    let list = await ShoppingList.findOne({ user: req.user.id, weekStart });

    if (!list) {
      const plan = await MealPlan.findOne({ user: req.user.id, weekStart });
      const items = buildShoppingList(plan?.days || []);
      list = await ShoppingList.create({ user: req.user.id, weekStart, items });
    }

    return res.json(list);
  } catch (error) {
    return next(error);
  }
}
