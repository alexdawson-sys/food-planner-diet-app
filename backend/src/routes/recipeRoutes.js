const express = require('express')
const auth = require('../middleware/auth')
const {
  listRecipes,
  createRecipe,
  favoriteRecipe,
  unfavoriteRecipe,
  getFavorites,
} = require('../controllers/recipeController')

const router = express.Router()

router.get('/', auth, listRecipes)
router.post('/', auth, createRecipe)
router.get('/favorites', auth, getFavorites)
router.post('/:id/favorite', auth, favoriteRecipe)
router.delete('/:id/favorite', auth, unfavoriteRecipe)

module.exports = router
