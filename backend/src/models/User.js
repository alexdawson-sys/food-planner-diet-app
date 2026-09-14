import mongoose from 'mongoose';

const targetsSchema = new mongoose.Schema(
  {
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fat: { type: Number, required: true },
    weeklyGoalDelta: { type: Number, default: 0.5 },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    age: { type: Number, default: 30 },
    height: { type: Number, default: 170 },
    currentWeight: { type: Number, default: 80 },
    goalWeight: { type: Number, default: 70 },
    gender: { type: String, enum: ['male', 'female', 'non-binary'], default: 'female' },
    activityLevel: {
      type: String,
      enum: ['sedentary', 'light', 'moderate', 'active', 'athlete'],
      default: 'moderate',
    },
    units: {
      weight: { type: String, enum: ['kg', 'lbs'], default: 'kg' },
      height: { type: String, enum: ['cm', 'in'], default: 'cm' },
    },
    notificationPreferences: {
      mealReminders: { type: Boolean, default: true },
      weightReminders: { type: Boolean, default: true },
    },
    theme: { type: String, enum: ['light', 'dark', 'system'], default: 'system' },
    targets: targetsSchema,
  },
  { timestamps: true },
);

export const User = mongoose.model('User', userSchema);
