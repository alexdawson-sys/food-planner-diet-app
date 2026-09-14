const express = require('express')
const auth = require('../middleware/auth')
const {
  listShoppingLists,
  createManualList,
  generateFromMealPlans,
  toggleShoppingItem,
} = require('../controllers/shoppingListController')

const router = express.Router()

router.get('/', auth, listShoppingLists)
router.post('/', auth, createManualList)
router.post('/generate', auth, generateFromMealPlans)
router.patch('/:listId/items/:itemId/toggle', auth, toggleShoppingItem)

module.exports = router
