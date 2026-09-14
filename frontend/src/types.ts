export type MacroTargets = {
  calories: number
  protein: number
  carbs: number
  fats: number
}

export type Nutrition = MacroTargets & {
  micronutrients?: {
    fiber?: number
    sodium?: number
    sugar?: number
    potassium?: number
  }
}

export type UserProfile = {
  height?: number
  weight?: number
  age?: number
  gender?: 'male' | 'female' | 'other'
  activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active'
  goal?: 'lose' | 'maintain' | 'gain'
}

export type User = {
  _id: string
  name: string
  email: string
  profile: UserProfile
  targets: MacroTargets
}
