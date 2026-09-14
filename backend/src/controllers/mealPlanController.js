import { MealPlan } from '../models/MealPlan.js';
import { ShoppingList } from '../models/ShoppingList.js';
import { buildShoppingList, startOfWeek } from '../utils/nutrition.js';

function normalizeWeek(value) {
  return new Date(value || startOfWeek()).toISOString().split('T')[0];
}

export async function saveMealPlan(req, res, next) {
  try {
    const weekStart = normalizeWeek(req.body.weekStart);
    const payload = { ...req.body, weekStart, user: req.user.id };
    const plan = await MealPlan.findOneAndUpdate(
      { user: req.user.id, weekStart },
      payload,
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
