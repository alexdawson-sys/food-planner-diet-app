const MealPlan = require('../models/MealPlan')
const MealTemplate = require('../models/MealTemplate')
const mongoose = require('mongoose')

const mealKeys = ['breakfast', 'lunch', 'dinner', 'snacks']
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/

async function getMealPlanByDate(req, res, next) {
  try {
    const { date } = req.params
    if (!isoDatePattern.test(date)) return res.status(400).json({ message: 'Invalid date format' })
    const mealPlan = await MealPlan.findOne({ user: req.user.id, date })
    return res.json(mealPlan || { user: req.user.id, date, meals: { breakfast: [], lunch: [], dinner: [], snacks: [] } })
  } catch (error) {
    return next(error)
  }
}

async function addMeal(req, res, next) {
  try {
    const { date, mealType, item } = req.body
    if (typeof date !== 'string' || !isoDatePattern.test(date)) {
      return res.status(400).json({ message: 'Invalid date format' })
    }
    if (!mealKeys.includes(mealType)) return res.status(400).json({ message: 'Invalid meal type' })
    const safeDate = date.trim()

    const mealPlan =
      (await MealPlan.findOne({ user: req.user.id, date: safeDate })) ||
      new MealPlan({ user: req.user.id, date: safeDate, meals: { breakfast: [], lunch: [], dinner: [], snacks: [] } })

    mealPlan.meals[mealType].push(item)
    await mealPlan.save()
    return res.status(201).json(mealPlan)
  } catch (error) {
    return next(error)
  }
}

async function createTemplate(req, res, next) {
  try {
    const template = await MealTemplate.create({ user: req.user.id, ...req.body })
    return res.status(201).json(template)
  } catch (error) {
    return next(error)
  }
}

async function listTemplates(req, res, next) {
  try {
    const templates = await MealTemplate.find({ user: req.user.id }).sort({ createdAt: -1 })
    return res.json(templates)
  } catch (error) {
    return next(error)
  }
}

async function applyTemplate(req, res, next) {
  try {
    const { templateId, startDate } = req.body
    if (typeof startDate !== 'string' || !isoDatePattern.test(startDate)) {
      return res.status(400).json({ message: 'Invalid start date format' })
    }
    if (typeof templateId !== 'string' || !mongoose.isValidObjectId(templateId)) {
      return res.status(400).json({ message: 'Invalid template id' })
    }
    const templateObjectId = new mongoose.Types.ObjectId(templateId)
    const template = await MealTemplate.findOne({ _id: templateObjectId, user: req.user.id })
    if (!template) return res.status(404).json({ message: 'Template not found' })

    const base = new Date(startDate)
    const created = []

    for (const day of template.days) {
      const date = new Date(base)
      date.setDate(base.getDate() + day.dayOfWeek)
      const isoDate = date.toISOString().slice(0, 10)
      const mealPlan = await MealPlan.findOneAndUpdate(
        { user: req.user.id, date: isoDate },
        { meals: day.meals },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
      created.push(mealPlan)
    }

    return res.json(created)
  } catch (error) {
    return next(error)
  }
}

module.exports = { getMealPlanByDate, addMeal, createTemplate, listTemplates, applyTemplate }
