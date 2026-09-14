import { useState } from 'react'
import type { FormEvent } from 'react'
import { Card } from '../components/Card'

type MealPlannerPageProps = {
  date: string
  meals: Record<string, Array<{ name: string; servings: number }>>
  onAddMeal: (payload: {
    date: string
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snacks'
    item: {
      name: string
      servings: number
      nutrition: { calories: number; protein: number; carbs: number; fats: number }
    }
  }) => Promise<void>
  onDateChange: (date: string) => void
}

export function MealPlannerPage({ date, meals, onAddMeal, onDateChange }: MealPlannerPageProps) {
  const [mealType, setMealType] = useState<'breakfast' | 'lunch' | 'dinner' | 'snacks'>('breakfast')
  const [name, setName] = useState('')
  const [servings, setServings] = useState(1)
  const [calories, setCalories] = useState(300)
  const [protein, setProtein] = useState(20)
  const [carbs, setCarbs] = useState(30)
  const [fats, setFats] = useState(10)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await onAddMeal({ date, mealType, item: { name, servings, nutrition: { calories, protein, carbs, fats } } })
    setName('')
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Add Meal">
        <div className="mb-3">
          <label className="text-sm">Date</label>
          <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" type="date" value={date} onChange={(e) => onDateChange(e.target.value)} />
        </div>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <select className="w-full rounded-lg border border-slate-300 px-3 py-2" value={mealType} onChange={(e) => setMealType(e.target.value as 'breakfast' | 'lunch' | 'dinner' | 'snacks')}>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snacks">Snacks</option>
          </select>
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Meal name" value={name} onChange={(e) => setName(e.target.value)} required />
          <div className="grid grid-cols-2 gap-2">
            {[{label:'Servings',value:servings,set:setServings},{label:'Calories',value:calories,set:setCalories},{label:'Protein',value:protein,set:setProtein},{label:'Carbs',value:carbs,set:setCarbs},{label:'Fats',value:fats,set:setFats}].map((item)=> (
              <input key={item.label} className="rounded-lg border border-slate-300 px-3 py-2" type="number" placeholder={item.label} value={item.value} onChange={(e)=>item.set(Number(e.target.value))} />
            ))}
          </div>
          <button className="w-full rounded-lg bg-primary px-3 py-2 text-white" type="submit">Add to plan</button>
        </form>
      </Card>
      <Card title="Today's Meal Plan">
        <div className="space-y-3">
          {(['breakfast', 'lunch', 'dinner', 'snacks'] as const).map((type) => (
            <div key={type}>
              <h3 className="font-medium capitalize">{type}</h3>
              <ul className="ml-5 list-disc text-sm text-slate-600">
                {(meals[type] || []).map((meal, index) => (
                  <li key={`${meal.name}-${index}`}>{meal.name} ({meal.servings} serving)</li>
                ))}
                {!(meals[type] || []).length && <li className="list-none text-slate-400">No items</li>}
              </ul>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
