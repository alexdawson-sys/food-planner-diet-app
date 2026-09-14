import { User } from '../models/User.js';
import { calculateTargets } from '../utils/nutrition.js';

function buildProfileUpdates(body = {}) {
  const updates = {};
  const stringFields = ['name', 'gender', 'activityLevel', 'theme'];
  const numberFields = ['age', 'height', 'currentWeight', 'goalWeight'];

  stringFields.forEach((field) => {
    if (typeof body[field] === 'string' && body[field].trim()) {
      updates[field] = body[field].trim();
    }
  });

  numberFields.forEach((field) => {
    const value = Number(body[field]);
    if (Number.isFinite(value)) {
      updates[field] = value;
    }
  });

  if (body.units?.weight === 'kg' || body.units?.weight === 'lbs') {
    updates.units = {
      weight: body.units.weight,
      height: body.units?.height === 'in' ? 'in' : 'cm',
    };
  }

  return updates;
}

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
    const currentUser = await User.findById(req.user.id).select('-passwordHash');
    const updates = buildProfileUpdates(req.body);
    const targetInput = {
      gender: updates.gender || currentUser.gender,
      age: updates.age ?? currentUser.age,
      height: updates.height ?? currentUser.height,
      currentWeight: updates.currentWeight ?? currentUser.currentWeight,
      goalWeight: updates.goalWeight ?? currentUser.goalWeight,
      activityLevel: updates.activityLevel || currentUser.activityLevel,
    };
    const targets = calculateTargets(targetInput);
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
    const safeGoals = {};
    ['calories', 'protein', 'carbs', 'fat', 'weeklyGoalDelta'].forEach((field) => {
      const value = Number(req.body[field]);
      if (Number.isFinite(value)) {
        safeGoals[field] = value;
      }
    });
    user.targets = { ...user.targets.toObject(), ...safeGoals };
    await user.save();
    return res.json(user.targets);
  } catch (error) {
    return next(error);
  }
}
