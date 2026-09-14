import mongoose from 'mongoose';
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
    const foods = Array.isArray(req.body.foods) ? req.body.foods : [];
    const type = ['breakfast', 'lunch', 'dinner', 'snack'].includes(req.body.type) ? req.body.type : null;
    const date = req.body.date ? new Date(req.body.date) : new Date();

    if (!type || Number.isNaN(date.getTime())) {
      return res.status(400).json({ message: 'Valid meal type and date are required' });
    }

    const meal = await Meal.create({
      user: req.user.id,
      type,
      date,
      foods,
      totals: summarizeMealEntries(foods),
      notes: typeof req.body.notes === 'string' ? req.body.notes.trim() : undefined,
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
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid meal id' });
    }
    const mealId = new mongoose.Types.ObjectId(req.params.id);

    const foods = Array.isArray(req.body.foods) ? req.body.foods : [];
    const update = {
      foods,
      totals: summarizeMealEntries(foods),
    };

    if (typeof req.body.notes === 'string') {
      update.notes = req.body.notes.trim();
    }

    if (['breakfast', 'lunch', 'dinner', 'snack'].includes(req.body.type)) {
      update.type = req.body.type;
    }

    if (req.body.date) {
      const date = new Date(req.body.date);
      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({ message: 'Invalid meal date' });
      }
      update.date = date;
    }

    const meal = await Meal.findOneAndUpdate(
      { _id: mealId, user: req.user.id },
      { $set: update },
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
