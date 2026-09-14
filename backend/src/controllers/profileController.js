const User = require('../models/User')
const { calculateTargets } = require('../utils/calculateTargets')

async function getProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('-password').populate('favoriteRecipes')
    return res.json(user)
  } catch (error) {
    return next(error)
  }
}

async function updateProfile(req, res, next) {
  try {
    const user = await User.findById(req.user.id)
    if (!user) return res.status(404).json({ message: 'User not found' })

    user.profile = { ...user.profile.toObject(), ...req.body }
    user.targets = calculateTargets(user.profile)
    await user.save()

    return res.json({ profile: user.profile, targets: user.targets })
  } catch (error) {
    return next(error)
  }
}

module.exports = { getProfile, updateProfile }
