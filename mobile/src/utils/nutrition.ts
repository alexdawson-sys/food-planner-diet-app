import { DayPlan, MacroTargets, Meal, MealItem, WeightEntry } from '../types';

const multipliers = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  athlete: 1.9,
};

export function calculateTargets(input: {
  gender: 'male' | 'female' | 'non-binary';
  age: number;
  height: number;
  currentWeight: number;
  goalWeight: number;
  activityLevel: keyof typeof multipliers;
}): MacroTargets {
  const bmr = input.gender === 'male'
    ? 10 * input.currentWeight + 6.25 * input.height - 5 * input.age + 5
    : 10 * input.currentWeight + 6.25 * input.height - 5 * input.age - 161;
  const calories = Math.max(1200, Math.round(bmr * multipliers[input.activityLevel] - 450));
  const protein = Math.round(input.currentWeight * 1.8);
  const fat = Math.round((calories * 0.28) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

  return {
    calories,
    protein,
    carbs,
    fat,
    weeklyGoalDelta: Number(Math.max(0.2, Math.abs(input.currentWeight - input.goalWeight) * 0.08).toFixed(1)),
  };
}

export function mealTotals(items: MealItem[]) {
  return items.reduce(
    (totals, item) => ({
      calories: totals.calories + item.calories * item.portion,
      protein: totals.protein + item.protein * item.portion,
      carbs: totals.carbs + item.carbs * item.portion,
      fat: totals.fat + item.fat * item.portion,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

export function dailyTotals(meals: Meal[]) {
  return meals.reduce(
    (totals, meal) => {
      const summary = mealTotals(meal.foods);
      return {
        calories: totals.calories + summary.calories,
        protein: totals.protein + summary.protein,
        carbs: totals.carbs + summary.carbs,
        fat: totals.fat + summary.fat,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

export function buildShoppingList(days: DayPlan[]) {
  const aggregated = new Map<string, { name: string; category: string; quantity: number; unit: string; estimatedCost: number }>();

  days.forEach((day) => {
    Object.values(day.meals).flat().forEach((item) => {
      const key = `${item.name}-${item.servingUnit}`;
      const existing = aggregated.get(key);
      if (existing) {
        existing.quantity += item.portion;
        existing.estimatedCost += item.estimatedCost;
      } else {
        aggregated.set(key, {
          name: item.name,
          category: item.category,
          quantity: item.portion,
          unit: item.servingUnit,
          estimatedCost: item.estimatedCost,
        });
      }
    });
  });

  return Array.from(aggregated.values()).map((item, index) => ({
    id: `shop-${index}`,
    ...item,
    checked: false,
  }));
}

export function weightStats(weights: WeightEntry[], goalWeight: number) {
  const first = weights[0]?.value ?? goalWeight;
  const current = weights[weights.length - 1]?.value ?? goalWeight;
  const totalLost = Number((first - current).toFixed(1));
  const weeks = Math.max(1, weights.length / 7);
  const averagePerWeek = Number((totalLost / weeks).toFixed(2));
  const goalProgress = first === goalWeight ? 100 : Math.max(0, Math.min(100, ((first - current) / (first - goalWeight)) * 100));
  const remaining = Math.max(0, current - goalWeight);
  const projectedGoalDate = averagePerWeek > 0 ? new Date(Date.now() + (remaining / averagePerWeek) * 7 * 86400000) : null;
  return { totalLost, averagePerWeek, goalProgress, projectedGoalDate };
}

export function formatShortDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
