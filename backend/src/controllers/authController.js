const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { calculateTargets } = require('../utils/calculateTargets')

function signToken(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' })
}

async function register(req, res, next) {
  try {
    const { name, email, password, profile = {} } = req.body
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ message: 'Email already in use' })

    const user = await User.create({ name, email, password, profile, targets: calculateTargets(profile) })
    const token = signToken(user)
    return res.status(201).json({ token, user })
  } catch (error) {
    return next(error)
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = signToken(user)
    return res.json({ token, user })
  } catch (error) {
    return next(error)
  }
}

module.exports = { register, login }
