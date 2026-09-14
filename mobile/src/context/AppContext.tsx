import React, { createContext, PropsWithChildren, useContext, useMemo, useState } from 'react';
import { Achievement, DayPlan, Food, Meal, MealItem, MealType, Profile, ShoppingItem, WeightEntry } from '../types';
import { buildShoppingList, calculateTargets, dailyTotals, weightStats } from '../utils/nutrition';

const today = new Date();
const iso = (offset = 0) => {
  const date = new Date(today);
  date.setDate(date.getDate() + offset);
  return date.toISOString();
};

const demoProfile: Profile = {
  name: 'Alex Dawson',
  email: 'alex@example.com',
  age: 31,
  height: 178,
  currentWeight: 89,
  goalWeight: 76,
  gender: 'male',
  activityLevel: 'moderate',
  units: { weight: 'kg', height: 'cm' },
  theme: 'light',
  reminderPreferences: { meal: true, weight: true, push: true },
  targets: calculateTargets({
    gender: 'male',
    age: 31,
    height: 178,
    currentWeight: 89,
    goalWeight: 76,
    activityLevel: 'moderate',
  }),
};

const foodsSeed: Food[] = [
  { id: 'food-1', name: 'Greek Yogurt Bowl', category: 'Protein', calories: 260, protein: 24, carbs: 26, fat: 7, fiber: 4, servingSize: 1, servingUnit: 'bowl', favorite: true },
  { id: 'food-2', name: 'Chicken Power Salad', category: 'Produce', calories: 410, protein: 38, carbs: 19, fat: 18, fiber: 8, servingSize: 1, servingUnit: 'plate', favorite: true },
  { id: 'food-3', name: 'Salmon Rice Bowl', category: 'Protein', calories: 520, protein: 36, carbs: 42, fat: 20, fiber: 6, servingSize: 1, servingUnit: 'bowl' },
  { id: 'food-4', name: 'Apple & Almond Pack', category: 'Snacks', calories: 190, protein: 6, carbs: 22, fat: 9, fiber: 5, servingSize: 1, servingUnit: 'pack' },
  { id: 'food-5', name: 'Turkey Chili', category: 'Meal Prep', calories: 360, protein: 32, carbs: 28, fat: 11, fiber: 9, servingSize: 1, servingUnit: 'container' },
  { id: 'food-6', name: 'Overnight Oats', category: 'Breakfast', calories: 320, protein: 18, carbs: 45, fat: 8, fiber: 7, servingSize: 1, servingUnit: 'jar', barcode: '1234567890123' },
];

const weightsSeed: WeightEntry[] = [
  { id: 'w-1', date: iso(-42), value: 94 },
  { id: 'w-2', date: iso(-35), value: 92.8 },
  { id: 'w-3', date: iso(-28), value: 91.9 },
  { id: 'w-4', date: iso(-21), value: 90.8 },
  { id: 'w-5', date: iso(-14), value: 90.2 },
  { id: 'w-6', date: iso(-7), value: 89.6 },
  { id: 'w-7', date: iso(0), value: 89 },
];

const mealsSeed: Meal[] = [
  { id: 'meal-1', type: 'breakfast', date: iso(0), foods: [{ ...foodsSeed[0], portion: 1, estimatedCost: 4.5 }] },
  { id: 'meal-2', type: 'lunch', date: iso(0), foods: [{ ...foodsSeed[1], portion: 1, estimatedCost: 8.5 }] },
  { id: 'meal-3', type: 'snack', date: iso(0), foods: [{ ...foodsSeed[3], portion: 1, estimatedCost: 2.1 }] },
  { id: 'meal-4', type: 'dinner', date: iso(0), foods: [{ ...foodsSeed[2], portion: 1, estimatedCost: 9.25 }] },
];

const weekDays: DayPlan[] = Array.from({ length: 7 }, (_, index) => {
  const date = new Date(today);
  date.setDate(today.getDate() - today.getDay() + 1 + index);
  const primary = foodsSeed[index % foodsSeed.length];
  const secondary = foodsSeed[(index + 2) % foodsSeed.length];

  return {
    date: date.toISOString(),
    meals: {
      breakfast: [{ ...foodsSeed[5], portion: 1, estimatedCost: 3.25 }],
      lunch: [{ ...primary, portion: 1, estimatedCost: 7.25 }],
      dinner: [{ ...secondary, portion: 1, estimatedCost: 8.4 }],
      snack: [{ ...foodsSeed[3], portion: 1, estimatedCost: 2.1 }],
    },
  };
});

const achievementsSeed: Achievement[] = [
  { id: 'a-1', title: '7-Day Streak', description: 'Logged meals every day this week.', earned: true },
  { id: 'a-2', title: 'First 5kg Lost', description: 'Lost the first 5 kilograms toward your goal.', earned: true },
  { id: 'a-3', title: 'Macro Master', description: 'Hit all macro targets on 5 days this month.', earned: false },
];

type ContextValue = {
  profile: Profile;
  weights: WeightEntry[];
  meals: Meal[];
  foods: Food[];
  weeklyPlan: DayPlan[];
  shoppingList: ShoppingItem[];
  achievements: Achievement[];
  daily: ReturnType<typeof dailyTotals>;
  stats: ReturnType<typeof weightStats>;
  quickAddMeal: (food: Food, type: MealType) => void;
  addCustomFood: (name: string) => void;
  addWeight: (value: number) => void;
  toggleShoppingItem: (id: string) => void;
  updateTargets: (targets: Profile['targets']) => void;
  updatePreference: (key: keyof Profile['reminderPreferences'], value: boolean) => void;
  toggleTheme: () => void;
  toggleUnits: () => void;
};

const AppContext = createContext<ContextValue | undefined>(undefined);

export function AppProvider({ children }: PropsWithChildren) {
  const [profile, setProfile] = useState(demoProfile);
  const [weights, setWeights] = useState(weightsSeed);
  const [meals, setMeals] = useState(mealsSeed);
  const [foods, setFoods] = useState(foodsSeed);
  const [weeklyPlan] = useState(weekDays);
  const [shoppingList, setShoppingList] = useState(buildShoppingList(weekDays));
  const [achievements] = useState(achievementsSeed);

  const daily = useMemo(() => dailyTotals(meals.filter((meal) => meal.date.slice(0, 10) === iso(0).slice(0, 10))), [meals]);
  const stats = useMemo(() => weightStats(weights, profile.goalWeight), [weights, profile.goalWeight]);

  const quickAddMeal = (food: Food, type: MealType) => {
    setMeals((current) => [
      ...current,
      { id: `meal-${current.length + 1}`, type, date: new Date().toISOString(), foods: [{ ...food, portion: 1, estimatedCost: 4.5 }] },
    ]);
  };

  const addCustomFood = (name: string) => {
    if (!name.trim()) return;
    setFoods((current) => [
      {
        id: `food-${current.length + 1}`,
        name,
        category: 'Custom',
        calories: 220,
        protein: 18,
        carbs: 20,
        fat: 8,
        fiber: 4,
        servingSize: 1,
        servingUnit: 'serving',
      },
      ...current,
    ]);
  };

  const addWeight = (value: number) => {
    if (!value) return;
    setWeights((current) => [...current, { id: `w-${current.length + 1}`, date: new Date().toISOString(), value }]);
    setProfile((current) => ({ ...current, currentWeight: value }));
  };

  const toggleShoppingItem = (id: string) => {
    setShoppingList((current) => current.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const updateTargets = (targets: Profile['targets']) => {
    setProfile((current) => ({ ...current, targets }));
  };

  const updatePreference = (key: keyof Profile['reminderPreferences'], value: boolean) => {
    setProfile((current) => ({ ...current, reminderPreferences: { ...current.reminderPreferences, [key]: value } }));
  };

  const toggleTheme = () => setProfile((current) => ({ ...current, theme: current.theme === 'light' ? 'dark' : 'light' }));
  const toggleUnits = () => setProfile((current) => ({
    ...current,
    units: current.units.weight === 'kg'
      ? { weight: 'lbs', height: 'in' }
      : { weight: 'kg', height: 'cm' },
  }));

  return (
    <AppContext.Provider
      value={{
        profile,
        weights,
        meals,
        foods,
        weeklyPlan,
        shoppingList,
        achievements,
        daily,
        stats,
        quickAddMeal,
        addCustomFood,
        addWeight,
        toggleShoppingItem,
        updateTargets,
        updatePreference,
        toggleTheme,
        toggleUnits,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
