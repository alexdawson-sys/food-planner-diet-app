const Recipe = require('../models/Recipe')
const User = require('../models/User')

async function listRecipes(req, res, next) {
  try {
    const search = req.query.search || ''
    const filter = search ? { name: { $regex: search, $options: 'i' } } : {}
    const recipes = await Recipe.find(filter).sort({ createdAt: -1 }).limit(100)
    return res.json(recipes)
  } catch (error) {
    return next(error)
  }
}

async function createRecipe(req, res, next) {
  try {
    const recipe = await Recipe.create({ ...req.body, user: req.user.id })
    return res.status(201).json(recipe)
  } catch (error) {
    return next(error)
  }
}

async function favoriteRecipe(req, res, next) {
  try {
    const user = await User.findById(req.user.id)
    const recipeId = req.params.id
    if (!user.favoriteRecipes.find((id) => String(id) === recipeId)) user.favoriteRecipes.push(recipeId)
    await user.save()
    return res.json({ favoriteRecipes: user.favoriteRecipes })
  } catch (error) {
    return next(error)
  }
}

async function unfavoriteRecipe(req, res, next) {
  try {
    const user = await User.findById(req.user.id)
    const recipeId = req.params.id
    user.favoriteRecipes = user.favoriteRecipes.filter((id) => String(id) !== recipeId)
    await user.save()
    return res.json({ favoriteRecipes: user.favoriteRecipes })
  } catch (error) {
    return next(error)
  }
}

async function getFavorites(req, res, next) {
  try {
    const user = await User.findById(req.user.id).populate('favoriteRecipes')
    return res.json(user.favoriteRecipes)
  } catch (error) {
    return next(error)
  }
}

module.exports = { listRecipes, createRecipe, favoriteRecipe, unfavoriteRecipe, getFavorites }
