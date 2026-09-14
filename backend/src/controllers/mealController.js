import { Meal } from '../models/Meal.js';
import { summarizeMealEntries } from '../utils/nutrition.js';

function todayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

export async function createMeal(req, res, next) {
  try {
    const foods = req.body.foods || [];
    const meal = await Meal.create({
      ...req.body,
      user: req.user.id,
      foods,
      totals: summarizeMealEntries(foods),
    });

    return res.status(201).json(meal);
  } catch (error) {
    return next(error);
  }
}

export async function getMealsToday(req, res, next) {
  try {
    const { start, end } = todayRange();
    const meals = await Meal.find({ user: req.user.id, date: { $gte: start, $lt: end } }).sort({ date: 1 });
    return res.json(meals);
  } catch (error) {
    return next(error);
  }
}

export async function updateMeal(req, res, next) {
  try {
    const foods = req.body.foods || [];
    const meal = await Meal.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { ...req.body, foods, totals: summarizeMealEntries(foods) },
      { new: true, runValidators: true },
    );
    return res.json(meal);
  } catch (error) {
    return next(error);
  }
}

export async function deleteMeal(req, res, next) {
  try {
    await Meal.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
