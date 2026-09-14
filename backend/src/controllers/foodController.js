import { Food } from '../models/Food.js';

export async function searchFoods(req, res, next) {
  try {
    const { query = '', barcode } = req.query;
    const filters = barcode
      ? { barcode }
      : { name: { $regex: query, $options: 'i' } };

    const foods = await Food.find({
      $and: [filters, { $or: [{ user: req.user.id }, { user: null }] }],
    })
      .sort({ favorite: -1, updatedAt: -1 })
      .limit(25);

    return res.json(foods);
  } catch (error) {
    return next(error);
  }
}

export async function createCustomFood(req, res, next) {
  try {
    const food = await Food.create({ ...req.body, user: req.user.id, source: 'custom' });
    return res.status(201).json(food);
  } catch (error) {
    return next(error);
  }
}

export async function getFavorites(req, res, next) {
  try {
    const favorites = await Food.find({ user: req.user.id, favorite: true }).sort({ updatedAt: -1 });
    return res.json(favorites);
  } catch (error) {
    return next(error);
  }
}
