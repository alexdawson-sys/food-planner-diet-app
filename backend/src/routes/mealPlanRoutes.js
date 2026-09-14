const express = require('express')
const auth = require('../middleware/auth')
const {
  getMealPlanByDate,
  addMeal,
  createTemplate,
  listTemplates,
  applyTemplate,
} = require('../controllers/mealPlanController')

const router = express.Router()

router.get('/:date', auth, getMealPlanByDate)
router.post('/meal', auth, addMeal)
router.get('/templates/all', auth, listTemplates)
router.post('/templates', auth, createTemplate)
router.post('/templates/apply', auth, applyTemplate)

module.exports = router
