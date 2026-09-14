import { Recipe } from '../models/Recipe.js';

export async function createRecipe(req, res, next) {
  try {
    const recipe = await Recipe.create({ ...req.body, user: req.user.id });
    return res.status(201).json(recipe);
  } catch (error) {
    return next(error);
  }
}

export async function getRecipes(req, res, next) {
  try {
    const recipes = await Recipe.find({ user: req.user.id }).sort({ favorite: -1, updatedAt: -1 });
    return res.json(recipes);
  } catch (error) {
    return next(error);
  }
}

export async function getRecipe(req, res, next) {
  try {
    const recipe = await Recipe.findOne({ _id: req.params.id, user: req.user.id });
    return res.json(recipe);
  } catch (error) {
    return next(error);
  }
}

export async function deleteRecipe(req, res, next) {
  try {
    await Recipe.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
