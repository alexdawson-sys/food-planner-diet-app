import { useMemo, useState } from 'react';

type MacroTargets = { calories: number; protein: number; carbs: number; fat: number };
type Food = { id: string; name: string; category: string; calories: number; protein: number; carbs: number; fat: number; favorite?: boolean };
type WeightEntry = { date: string; value: number };
type ShoppingItem = { id: string; name: string; category: string; quantity: number; unit: string; estimatedCost: number; checked: boolean };

type MealPlanDay = {
  date: string;
  breakfast: string;
  lunch: string;
  dinner: string;
};

const targets: MacroTargets = { calories: 2240, protein: 160, carbs: 214, fat: 70 };
const foods: Food[] = [
  { id: 'f1', name: 'Greek Yogurt Bowl', category: 'Breakfast', calories: 260, protein: 24, carbs: 26, fat: 7, favorite: true },
  { id: 'f2', name: 'Chicken Power Salad', category: 'Produce', calories: 410, protein: 38, carbs: 19, fat: 18, favorite: true },
  { id: 'f3', name: 'Salmon Rice Bowl', category: 'Protein', calories: 520, protein: 36, carbs: 42, fat: 20 },
  { id: 'f4', name: 'Turkey Chili', category: 'Meal Prep', calories: 360, protein: 32, carbs: 28, fat: 11 },
  { id: 'f5', name: 'Apple & Almond Pack', category: 'Snack', calories: 190, protein: 6, carbs: 22, fat: 9 },
];

const weightHistory: WeightEntry[] = [
  { date: 'Jul 28', value: 94 },
  { date: 'Aug 4', value: 92.8 },
  { date: 'Aug 11', value: 91.9 },
  { date: 'Aug 18', value: 90.8 },
  { date: 'Aug 25', value: 90.2 },
  { date: 'Sep 1', value: 89.6 },
  { date: 'Sep 14', value: 89 },
];

const weeklyPlan: MealPlanDay[] = [
  { date: 'Mon', breakfast: 'Overnight Oats', lunch: 'Chicken Power Salad', dinner: 'Turkey Chili' },
  { date: 'Tue', breakfast: 'Greek Yogurt Bowl', lunch: 'Salmon Rice Bowl', dinner: 'Turkey Chili' },
  { date: 'Wed', breakfast: 'Overnight Oats', lunch: 'Chicken Power Salad', dinner: 'Salmon Rice Bowl' },
  { date: 'Thu', breakfast: 'Greek Yogurt Bowl', lunch: 'Turkey Chili', dinner: 'Salmon Rice Bowl' },
];

const initialShopping: ShoppingItem[] = [
  { id: 's1', name: 'Baby spinach', category: 'Produce', quantity: 2, unit: 'bags', estimatedCost: 7.5, checked: false },
  { id: 's2', name: 'Greek yogurt', category: 'Protein', quantity: 4, unit: 'cups', estimatedCost: 6.8, checked: false },
  { id: 's3', name: 'Salmon fillets', category: 'Protein', quantity: 4, unit: 'pieces', estimatedCost: 18.2, checked: false },
  { id: 's4', name: 'Oats', category: 'Pantry', quantity: 1, unit: 'bag', estimatedCost: 4.2, checked: true },
];

function MacroBar({ label, value, target, color }: { label: string; value: number; target: number; color: string }) {
  const progress = Math.min(100, Math.round((value / target) * 100));
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-600">
        <span>{label}</span>
        <span>{value}g / {target}g</span>
      </div>
      <div className="h-3 rounded-full bg-slate-200">
        <div className="h-3 rounded-full" style={{ width: `${progress}%`, backgroundColor: color }} />
      </div>
      <p className="text-xs text-slate-500">{progress}% of target</p>
    </div>
  );
}

function LineChart({ entries }: { entries: WeightEntry[] }) {
  const points = entries.map((entry, index) => {
    const values = entries.map((item) => item.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = Math.max(1, max - min);
    const x = (index / Math.max(1, entries.length - 1)) * 620;
    const y = 180 - ((entry.value - min) / range) * 140;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 620 220" className="w-full overflow-visible">
      <polyline points={points} fill="none" stroke="#0f766e" strokeWidth="4" />
      {entries.map((entry, index) => {
        const values = entries.map((item) => item.value);
        const min = Math.min(...values);
        const max = Math.max(...values);
        const range = Math.max(1, max - min);
        const x = (index / Math.max(1, entries.length - 1)) * 620;
        const y = 180 - ((entry.value - min) / range) * 140;
        return <circle key={entry.date} cx={x} cy={y} r="6" fill="#0f766e" />;
      })}
    </svg>
  );
}

export default function App() {
  const [query, setQuery] = useState('');
  const [shopping, setShopping] = useState(initialShopping);
  const [darkMode, setDarkMode] = useState(false);
  const filteredFoods = useMemo(() => foods.filter((food) => food.name.toLowerCase().includes(query.toLowerCase())), [query]);
  const daily = { calories: 1380, protein: 104, carbs: 109, fat: 54 };
  const totalLost = (weightHistory[0].value - weightHistory[weightHistory.length - 1].value).toFixed(1);

  return (
    <div className={darkMode ? 'bg-slate-950 text-white' : 'text-slate-900'}>
      <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
        <section className="rounded-[2rem] bg-white/90 p-6 shadow-lg ring-1 ring-slate-200 backdrop-blur sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-3">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-teal-700">Food planner & diet coach</p>
              <h1 className="text-3xl font-semibold sm:text-4xl">Professional weight-loss planning from meals to macros.</h1>
              <p className="max-w-3xl text-sm text-slate-600 sm:text-base">Track weight, plan daily and weekly meals, manage shopping, monitor calorie trends, and keep mobile-first settings for reminders, dark mode, offline use, widgets, and fast barcode logging.</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl bg-slate-950 px-5 py-4 text-white">
                <p className="text-sm text-slate-300">Today's intake</p>
                <p className="mt-2 text-3xl font-semibold">{daily.calories}</p>
                <p className="text-sm text-slate-300">of {targets.calories} kcal</p>
              </div>
              <div className="rounded-3xl bg-teal-600 px-5 py-4 text-white">
                <p className="text-sm text-teal-100">Goal progress</p>
                <p className="mt-2 text-3xl font-semibold">{totalLost} kg</p>
                <p className="text-sm text-teal-100">lost so far</p>
              </div>
            </div>
          </div>
        </section>

        <nav className="grid gap-3 rounded-[2rem] bg-white/80 p-3 shadow-sm ring-1 ring-slate-200 sm:grid-cols-5">
          {['Dashboard', 'Planner', 'Progress', 'Shopping', 'Settings'].map((tab) => (
            <button key={tab} className="rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">{tab}</button>
          ))}
        </nav>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="space-y-6">
            <article className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Nutrition dashboard</h2>
                  <p className="mt-1 text-sm text-slate-500">Real-time calories, remaining intake, and macro pacing.</p>
                </div>
                <span className="rounded-full bg-teal-50 px-4 py-2 text-xs font-semibold text-teal-700">Remaining {targets.calories - daily.calories} kcal</span>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Current weight</p>
                  <p className="mt-2 text-2xl font-semibold">89 kg</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Goal weight</p>
                  <p className="mt-2 text-2xl font-semibold">76 kg</p>
                </div>
                <div className="rounded-3xl bg-slate-50 p-4">
                  <p className="text-sm text-slate-500">Projected goal</p>
                  <p className="mt-2 text-2xl font-semibold">Nov 28</p>
                </div>
              </div>
              <div className="mt-5 space-y-4">
                <MacroBar label="Protein" value={daily.protein} target={targets.protein} color="#0891b2" />
                <MacroBar label="Carbs" value={daily.carbs} target={targets.carbs} color="#2563eb" />
                <MacroBar label="Fats" value={daily.fat} target={targets.fat} color="#0f766e" />
              </div>
            </article>

            <article className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold">Onboarding & profile</h2>
              <p className="mt-1 text-sm text-slate-500">Secure email auth, profile setup, and automatic TDEE-based targets.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {['Email registration/login', 'Name, age, height, weight, goal weight', 'Gender and activity level', 'Custom calorie and macro targets'].map((item) => (
                  <div key={item} className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-600">{item}</div>
                ))}
              </div>
            </article>

            <article className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Weight progress analytics</h2>
                  <p className="mt-1 text-sm text-slate-500">Weekly, monthly, and yearly graph views with milestone tracking.</p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-medium">
                  {['Weekly', 'Monthly', 'Yearly'].map((label) => (
                    <span key={label} className="rounded-full bg-slate-100 px-3 py-2 text-slate-600">{label}</span>
                  ))}
                </div>
              </div>
              <div className="mt-5 rounded-3xl bg-slate-50 p-4">
                <LineChart entries={weightHistory} />
                <div className="mt-3 flex justify-between text-xs text-slate-500">
                  {weightHistory.map((entry) => <span key={entry.date}>{entry.date}</span>)}
                </div>
              </div>
              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-3xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Total lost</p><p className="mt-2 text-2xl font-semibold">{totalLost} kg</p></div>
                <div className="rounded-3xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Average / week</p><p className="mt-2 text-2xl font-semibold">0.83 kg</p></div>
                <div className="rounded-3xl bg-slate-50 p-4"><p className="text-sm text-slate-500">Achievement</p><p className="mt-2 text-2xl font-semibold">7-day streak</p></div>
              </div>
            </article>

            <article className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Meal planning & food database</h2>
                  <p className="mt-1 text-sm text-slate-500">Daily planning, recipes, favorites, custom foods, and barcode-ready search.</p>
                </div>
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none ring-0"
                  placeholder="Search foods, calories, macros"
                />
              </div>
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {filteredFoods.map((food) => (
                  <div key={food.id} className="rounded-3xl border border-slate-200 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{food.name}</h3>
                        <p className="mt-1 text-sm text-slate-500">{food.category} · {food.calories} kcal</p>
                      </div>
                      {food.favorite ? <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">Favorite</span> : null}
                    </div>
                    <p className="mt-3 text-sm text-slate-600">P{food.protein} · C{food.carbs} · F{food.fat} · custom portions supported</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-2 text-xs font-medium">
                {['Favorite recipes', 'Recently added foods', 'Portion-aware custom foods', 'Barcode scan flow'].map((item) => (
                  <span key={item} className="rounded-full bg-slate-100 px-3 py-2 text-slate-600">{item}</span>
                ))}
              </div>
            </article>
          </section>

          <aside className="space-y-6">
            <article className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold">Weekly meal plan</h2>
              <p className="mt-1 text-sm text-slate-500">Presets, reusable templates, and copy-forward planning.</p>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
                {['Balanced', 'High-protein', 'Low-carb', 'Keto', 'Copy last week'].map((item) => (
                  <span key={item} className="rounded-full bg-teal-50 px-3 py-2 text-teal-700">{item}</span>
                ))}
              </div>
              <div className="mt-5 space-y-4">
                {weeklyPlan.map((day) => (
                  <div key={day.date} className="rounded-3xl bg-slate-50 p-4">
                    <p className="font-semibold text-slate-800">{day.date}</p>
                    <p className="mt-2 text-sm text-slate-600">Breakfast: {day.breakfast}</p>
                    <p className="text-sm text-slate-600">Lunch: {day.lunch}</p>
                    <p className="text-sm text-slate-600">Dinner: {day.dinner}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <h2 className="text-xl font-semibold">Shopping list</h2>
              <p className="mt-1 text-sm text-slate-500">Auto-generated, categorized, cost-aware, and shareable.</p>
              <button className="mt-4 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">Add manual item</button>
              <div className="mt-5 space-y-3">
                {shopping.map((item) => (
                  <label key={item.id} className="flex items-start gap-3 rounded-3xl bg-slate-50 p-4">
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => setShopping((current) => current.map((entry) => entry.id === item.id ? { ...entry, checked: !entry.checked } : entry))}
                      className="mt-1 h-4 w-4"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <p className="font-medium">{item.name}</p>
                        <span className="text-sm text-slate-500">${item.estimatedCost.toFixed(2)}</span>
                      </div>
                      <p className="text-sm text-slate-500">{item.category} · {item.quantity} {item.unit}</p>
                    </div>
                  </label>
                ))}
              </div>
            </article>

            <article className="rounded-[2rem] bg-white p-6 shadow-sm ring-1 ring-slate-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold">Settings & preferences</h2>
                  <p className="mt-1 text-sm text-slate-500">Notifications, dark mode, units, backup, and offline sync.</p>
                </div>
                <button onClick={() => setDarkMode((value) => !value)} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white">Toggle theme</button>
              </div>
              <div className="mt-5 grid gap-3 text-sm text-slate-600">
                {['Meal reminders', 'Weight reminders', 'Push notifications', 'Backup & restore', 'Widgets', 'Offline mode', 'Barcode scanning'].map((feature) => (
                  <div key={feature} className="rounded-3xl bg-slate-50 px-4 py-3">{feature}</div>
                ))}
              </div>
            </article>
          </aside>
        </div>
      </main>
    </div>
  );
}
