const Food = require('../models/Food')

async function listFoods(req, res, next) {
  try {
    const search = req.query.search || ''
    const filter = search ? { name: { $regex: search, $options: 'i' } } : {}
    const foods = await Food.find(filter).limit(100)
    return res.json(foods)
  } catch (error) {
    return next(error)
  }
}

async function createFood(req, res, next) {
  try {
    const food = await Food.create(req.body)
    return res.status(201).json(food)
  } catch (error) {
    return next(error)
  }
}

module.exports = { listFoods, createFood }
