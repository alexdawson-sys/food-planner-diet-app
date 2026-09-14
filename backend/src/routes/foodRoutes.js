const express = require('express')
const auth = require('../middleware/auth')
const { listFoods, createFood } = require('../controllers/foodController')

const router = express.Router()

router.get('/', auth, listFoods)
router.post('/', auth, createFood)

module.exports = router
