const activityFactors = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
}

function calculateTargets(profile = {}) {
  const { height = 170, weight = 70, age = 30, gender = 'male', activityLevel = 'moderate', goal = 'maintain' } = profile
  const genderOffset = gender === 'female' ? -161 : 5
  const bmr = 10 * weight + 6.25 * height - 5 * age + genderOffset
  const maintenance = Math.round(bmr * (activityFactors[activityLevel] || activityFactors.moderate))

  let calorieAdjustment = 0
  if (goal === 'lose') calorieAdjustment = -400
  if (goal === 'gain') calorieAdjustment = 300

  const calories = Math.max(1200, maintenance + calorieAdjustment)
  const protein = Math.round((calories * 0.3) / 4)
  const carbs = Math.round((calories * 0.4) / 4)
  const fats = Math.round((calories * 0.3) / 9)

  return { calories, protein, carbs, fats }
}

module.exports = { calculateTargets }
