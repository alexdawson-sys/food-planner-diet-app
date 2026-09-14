const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const mongoSanitize = require('express-mongo-sanitize')
const errorHandler = require('./middleware/errorHandler')
const { authLimiter, apiLimiter } = require('./middleware/rateLimit')

const authRoutes = require('./routes/authRoutes')
const userRoutes = require('./routes/userRoutes')
const foodRoutes = require('./routes/foodRoutes')
const recipeRoutes = require('./routes/recipeRoutes')
const mealPlanRoutes = require('./routes/mealPlanRoutes')
const trackingRoutes = require('./routes/trackingRoutes')
const shoppingListRoutes = require('./routes/shoppingListRoutes')
const progressRoutes = require('./routes/progressRoutes')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.use(mongoSanitize())
app.use('/api', apiLimiter)

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authLimiter, authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/foods', foodRoutes)
app.use('/api/recipes', recipeRoutes)
app.use('/api/meal-plans', mealPlanRoutes)
app.use('/api/tracking', trackingRoutes)
app.use('/api/shopping-lists', shoppingListRoutes)
app.use('/api/progress', progressRoutes)

app.use(errorHandler)

module.exports = app
