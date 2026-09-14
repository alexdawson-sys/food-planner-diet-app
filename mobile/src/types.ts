export type MacroTargets = {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  weeklyGoalDelta: number;
};

export type Profile = {
  name: string;
  email: string;
  age: number;
  height: number;
  currentWeight: number;
  goalWeight: number;
  gender: 'male' | 'female' | 'non-binary';
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'athlete';
  units: { weight: 'kg' | 'lbs'; height: 'cm' | 'in' };
  theme: 'light' | 'dark';
  reminderPreferences: { meal: boolean; weight: boolean; push: boolean };
  targets: MacroTargets;
};

export type WeightEntry = { id: string; date: string; value: number };

export type Food = {
  id: string;
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  barcode?: string;
  servingSize: number;
  servingUnit: string;
  favorite?: boolean;
};

export type MealItem = Food & { portion: number; estimatedCost: number };

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type Meal = {
  id: string;
  type: MealType;
  date: string;
  foods: MealItem[];
};

export type DayPlan = {
  date: string;
  meals: Record<MealType, MealItem[]>;
};

export type ShoppingItem = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  estimatedCost: number;
  checked: boolean;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  earned: boolean;
};
