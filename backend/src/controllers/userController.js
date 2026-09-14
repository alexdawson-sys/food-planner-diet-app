import { User } from '../models/User.js';
import { calculateTargets } from '../utils/nutrition.js';

export async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash');
    return res.json(user);
  } catch (error) {
    return next(error);
  }
}

export async function updateProfile(req, res, next) {
  try {
    const updates = req.body;
    const targets = calculateTargets(updates);
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { ...updates, targets },
      { new: true, runValidators: true },
    ).select('-passwordHash');

    return res.json(user);
  } catch (error) {
    return next(error);
  }
}

export async function updateGoals(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    user.targets = { ...user.targets.toObject(), ...req.body };
    await user.save();
    return res.json(user.targets);
  } catch (error) {
    return next(error);
  }
}
