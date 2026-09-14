const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const profileSchema = new mongoose.Schema(
  {
    height: Number,
    weight: Number,
    age: Number,
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'other' },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'very_active'],
      default: 'moderate',
    },
    goal: { type: String, enum: ['lose', 'maintain', 'gain'], default: 'maintain' },
  },
  { _id: false }
)

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: 6 },
    profile: { type: profileSchema, default: () => ({}) },
    targets: {
      calories: { type: Number, default: 2000 },
      protein: { type: Number, default: 150 },
      carbs: { type: Number, default: 200 },
      fats: { type: Number, default: 67 },
    },
    favoriteRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recipe' }],
  },
  { timestamps: true }
)

userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next()
  this.password = await bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password)
}

module.exports = mongoose.model('User', userSchema)
