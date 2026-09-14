import { useEffect, useState } from 'react'
import { api } from './api'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { MealPlannerPage } from './pages/MealPlannerPage'
import { ProfilePage } from './pages/ProfilePage'
import { ProgressPage } from './pages/ProgressPage'
import { RecipesPage } from './pages/RecipesPage'
import { ShoppingListPage } from './pages/ShoppingListPage'
import { TrackingPage } from './pages/TrackingPage'
import type { MacroTargets, Nutrition, User } from './types'

type Tab = 'dashboard' | 'profile' | 'meal-planner' | 'recipes' | 'tracking' | 'shopping' | 'progress'

const tabs: Array<{ key: Tab; label: string }> = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'profile', label: 'Profile' },
  { key: 'meal-planner', label: 'Meal Planner' },
  { key: 'recipes', label: 'Recipes' },
  { key: 'tracking', label: 'Tracking' },
  { key: 'shopping', label: 'Shopping Lists' },
  { key: 'progress', label: 'Progress' },
]

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  const [user, setUser] = useState<User | null>(null)
  const [tab, setTab] = useState<Tab>('dashboard')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [intake, setIntake] = useState<Nutrition>({ calories: 0, protein: 0, carbs: 0, fats: 0, micronutrients: {} })
  const [target, setTarget] = useState<MacroTargets>({ calories: 2000, protein: 150, carbs: 200, fats: 67 })
  const [meals, setMeals] = useState<Record<string, Array<{ name: string; servings: number }>>>({})
  const [recipes, setRecipes] = useState<Array<{ _id: string; name: string; description?: string }>>([])
  const [favorites, setFavorites] = useState<Array<{ _id: string; name: string; description?: string }>>([])
  const [shoppingLists, setShoppingLists] = useState<Array<{ _id: string; name: string; items: Array<{ _id: string; name: string; quantity: number; unit: string; purchased: boolean }> }>>([])
  const [progressEntries, setProgressEntries] = useState<Array<{ _id: string; date: string; weight: number }>>([])
  const [weeklyChange, setWeeklyChange] = useState(0)
  const [monthlyChange, setMonthlyChange] = useState(0)

  async function bootstrap() {
    if (!token) return
    const [profile, daily, plan, recipeList, favs, lists, progress, weekly, monthly] = await Promise.all([
      api.getProfile(token),
      api.getDailySummary(token, date),
      api.getMealPlan(token, date),
      api.listRecipes(token),
      api.getFavorites(token),
      api.listShoppingLists(token),
      api.listProgress(token),
      api.progressReport(token, 'weekly'),
      api.progressReport(token, 'monthly'),
    ])
    setUser(profile)
    setIntake(daily.intake)
    setTarget(daily.target)
    setMeals(plan.meals || {})
    setRecipes(recipeList)
    setFavorites(favs)
    setShoppingLists(lists)
    setProgressEntries(progress)
    setWeeklyChange(weekly.change || 0)
    setMonthlyChange(monthly.change || 0)
  }

  useEffect(() => {
    bootstrap().catch(() => setToken(''))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, date])

  async function handleLogin(email: string, password: string) {
    const result = await api.login({ email, password })
    localStorage.setItem('token', result.token)
    setToken(result.token)
  }

  async function handleRegister(name: string, email: string, password: string) {
    const result = await api.register({ name, email, password })
    localStorage.setItem('token', result.token)
    setToken(result.token)
  }

  if (!token) return <AuthPage onLogin={handleLogin} onRegister={handleRegister} />
  if (!user) return <div className="p-8 text-center text-slate-500">Loading...</div>

  let activeView = <DashboardPage intake={intake} target={target} />
  if (tab === 'profile') {
    activeView = (
      <ProfilePage
        user={user}
        onSave={async (updates) => {
          await api.updateProfile(token, updates)
          await bootstrap()
        }}
      />
    )
  } else if (tab === 'meal-planner') {
    activeView = (
      <MealPlannerPage
        date={date}
        meals={meals}
        onDateChange={setDate}
        onAddMeal={async (payload) => {
          await api.addMeal(token, payload)
          await bootstrap()
        }}
      />
    )
  } else if (tab === 'recipes') {
    activeView = (
      <RecipesPage
        recipes={recipes}
        favorites={favorites}
        onSearch={async (search) => setRecipes(await api.listRecipes(token, search))}
        onCreate={async (payload) => {
          await api.createRecipe(token, payload)
          await bootstrap()
        }}
        onFavorite={async (id) => {
          await api.favoriteRecipe(token, id)
          setFavorites(await api.getFavorites(token))
        }}
      />
    )
  } else if (tab === 'tracking') {
    activeView = <TrackingPage intake={intake} target={target} />
  } else if (tab === 'shopping') {
    activeView = (
      <ShoppingListPage
        lists={shoppingLists}
        onCreateManual={async (name, itemName) => {
          await api.createShoppingList(token, { name, items: [{ name: itemName, quantity: 1, unit: 'item' }] })
          setShoppingLists(await api.listShoppingLists(token))
        }}
        onGenerate={async (startDate, endDate) => {
          await api.generateShoppingList(token, { startDate, endDate })
          setShoppingLists(await api.listShoppingLists(token))
        }}
        onToggle={async (listId, itemId) => {
          await api.toggleShoppingItem(token, listId, itemId)
          setShoppingLists(await api.listShoppingLists(token))
        }}
      />
    )
  } else if (tab === 'progress') {
    activeView = (
      <ProgressPage
        entries={progressEntries}
        weeklyChange={weeklyChange}
        monthlyChange={monthlyChange}
        onAdd={async (entryDate, weight) => {
          await api.addProgress(token, { date: entryDate, weight })
          await bootstrap()
        }}
      />
    )
  }

  return (
    <main className="mx-auto min-h-screen max-w-6xl p-4 lg:p-8">
      <header className="mb-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Food Planner & Diet Tracker</h1>
            <p className="text-sm text-slate-500">Welcome, {user.name}</p>
          </div>
          <button
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
            onClick={() => {
              localStorage.removeItem('token')
              setToken('')
            }}
          >
            Logout
          </button>
        </div>
      </header>
      <nav className="mb-6 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item.key}
            className={`rounded-lg px-3 py-2 text-sm ${tab === item.key ? 'bg-primary text-white' : 'bg-white ring-1 ring-slate-200'}`}
            onClick={() => setTab(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      {activeView}
    </main>
  )
}

export default App
