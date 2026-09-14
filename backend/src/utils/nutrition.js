const activityMultipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

export const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

export function calculateTargets(profile = {}) {
  const {
    gender = 'female',
    age = 30,
    height = 170,
    currentWeight = 80,
    goalWeight = 70,
    activityLevel = 'moderate',
  } = profile;

  const isMetricWeight = currentWeight < 250;
  const weightKg = isMetricWeight ? currentWeight : currentWeight * 0.453592;
  const heightCm = height > 100 ? height : height * 2.54;

  const bmr = gender === 'male'
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;

  const tdee = Math.round(bmr * (activityMultipliers[activityLevel] ?? activityMultipliers.moderate));
  const calories = Math.max(1200, tdee - 450);
  const protein = Math.round(weightKg * 1.8);
  const fat = Math.round((calories * 0.28) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);
  const weeklyGoalDelta = Math.max(0.2, Math.min(1, Math.abs(currentWeight - goalWeight) * 0.08));

  return {
    calories,
    protein,
    carbs,
    fat,
    weeklyGoalDelta: Number(weeklyGoalDelta.toFixed(1)),
  };
}

export function summarizeMealEntries(entries = []) {
  return entries.reduce(
    (totals, entry) => ({
      calories: totals.calories + (entry.calories || 0),
      protein: totals.protein + (entry.protein || 0),
      carbs: totals.carbs + (entry.carbs || 0),
      fat: totals.fat + (entry.fat || 0),
      fiber: totals.fiber + (entry.fiber || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  );
}

export function startOfWeek(dateInput = new Date()) {
  const date = new Date(dateInput);
  date.setHours(0, 0, 0, 0);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  return date;
}

export function formatDateKey(dateInput = new Date()) {
  const date = new Date(dateInput);
  return date.toISOString().split('T')[0];
}

export function buildShoppingList(days = []) {
  const aggregate = new Map();

  days.forEach((day) => {
    Object.values(day.meals || {}).flat().forEach((item) => {
      const key = `${item.name}-${item.unit || 'serving'}`.toLowerCase();
      const existing = aggregate.get(key);
      if (existing) {
        existing.quantity += item.portion || 1;
        existing.estimatedCost += item.estimatedCost || 0;
      } else {
        aggregate.set(key, {
          name: item.name,
          category: item.category || 'General',
          quantity: item.portion || 1,
          unit: item.unit || 'serving',
          estimatedCost: item.estimatedCost || 0,
          checked: false,
        });
      }
    });
  });

  return Array.from(aggregate.values()).sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name));
}

export function rangeMealsByDays(meals = [], days = 7) {
  const since = new Date();
  since.setDate(since.getDate() - days + 1);
  since.setHours(0, 0, 0, 0);
  return meals.filter((meal) => new Date(meal.date) >= since);
}
