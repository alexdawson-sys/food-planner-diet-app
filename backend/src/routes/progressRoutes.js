const express = require('express')
const auth = require('../middleware/auth')
const { addProgressEntry, getProgressEntries, getProgressReport } = require('../controllers/progressController')

const router = express.Router()

router.get('/', auth, getProgressEntries)
router.post('/', auth, addProgressEntry)
router.get('/report/summary', auth, getProgressReport)

module.exports = router
