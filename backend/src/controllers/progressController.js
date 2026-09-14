const ProgressEntry = require('../models/ProgressEntry')

async function addProgressEntry(req, res, next) {
  try {
    const entry = await ProgressEntry.create({ user: req.user.id, ...req.body })
    return res.status(201).json(entry)
  } catch (error) {
    return next(error)
  }
}

async function getProgressEntries(req, res, next) {
  try {
    const entries = await ProgressEntry.find({ user: req.user.id }).sort({ date: 1 })
    return res.json(entries)
  } catch (error) {
    return next(error)
  }
}

async function getProgressReport(req, res, next) {
  try {
    const period = req.query.period || 'weekly'
    const days = period === 'monthly' ? 30 : 7
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - days)
    const cutoffDate = cutoff.toISOString().slice(0, 10)

    const entries = await ProgressEntry.find({ user: req.user.id, date: { $gte: cutoffDate } }).sort({ date: 1 })
    const startWeight = entries[0]?.weight ?? null
    const endWeight = entries[entries.length - 1]?.weight ?? null

    return res.json({ period, entries, startWeight, endWeight, change: startWeight && endWeight ? endWeight - startWeight : 0 })
  } catch (error) {
    return next(error)
  }
}

module.exports = { addProgressEntry, getProgressEntries, getProgressReport }
