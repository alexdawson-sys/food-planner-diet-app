import { Weight } from '../models/Weight.js';
import { User } from '../models/User.js';

export async function createWeightEntry(req, res, next) {
  try {
    const entry = await Weight.create({
      user: req.user.id,
      value: req.body.value,
      date: req.body.date || new Date(),
    });

    await User.findByIdAndUpdate(req.user.id, { currentWeight: req.body.value });
    return res.status(201).json(entry);
  } catch (error) {
    return next(error);
  }
}

export async function getWeightHistory(req, res, next) {
  try {
    const entries = await Weight.find({ user: req.user.id }).sort({ date: 1 });
    return res.json(entries);
  } catch (error) {
    return next(error);
  }
}

export async function getWeightStats(req, res, next) {
  try {
    const entries = await Weight.find({ user: req.user.id }).sort({ date: 1 });
    const user = await User.findById(req.user.id).select('goalWeight');

    if (!entries.length) {
      return res.json({ totalLost: 0, averagePerWeek: 0, projectedGoalDate: null, goalProgress: 0 });
    }

    const first = entries[0].value;
    const last = entries.at(-1).value;
    const totalLost = Number((first - last).toFixed(1));
    const weeks = Math.max(1, (new Date(entries.at(-1).date) - new Date(entries[0].date)) / (1000 * 60 * 60 * 24 * 7));
    const averagePerWeek = Number((totalLost / weeks).toFixed(2));
    const remaining = Math.max(0, last - user.goalWeight);
    const projectedGoalDate = averagePerWeek > 0
      ? new Date(Date.now() + (remaining / averagePerWeek) * 7 * 24 * 60 * 60 * 1000)
      : null;
    const goalProgress = first === user.goalWeight ? 100 : Math.min(100, Math.max(0, ((first - last) / (first - user.goalWeight)) * 100));

    return res.json({
      totalLost,
      averagePerWeek,
      projectedGoalDate,
      goalProgress: Number(goalProgress.toFixed(1)),
    });
  } catch (error) {
    return next(error);
  }
}
