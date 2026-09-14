const express = require('express')
const auth = require('../middleware/auth')
const { getDailySummary } = require('../controllers/trackingController')

const router = express.Router()

router.get('/daily', auth, getDailySummary)

module.exports = router
