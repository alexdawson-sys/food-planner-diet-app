import { useState } from 'react'
import type { FormEvent } from 'react'
import { Card } from '../components/Card'

type ProgressEntry = { _id: string; date: string; weight: number }

type ProgressPageProps = {
  entries: ProgressEntry[]
  weeklyChange: number
  monthlyChange: number
  onAdd: (date: string, weight: number) => Promise<void>
}

export function ProgressPage({ entries, weeklyChange, monthlyChange, onAdd }: ProgressPageProps) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [weight, setWeight] = useState(70)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await onAdd(date, weight)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Weight Tracking">
        <form className="space-y-2" onSubmit={handleSubmit}>
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2" type="number" step="0.1" value={weight} onChange={(e) => setWeight(Number(e.target.value))} />
          <button className="w-full rounded-lg bg-primary px-3 py-2 text-white" type="submit">Add Entry</button>
        </form>
      </Card>
      <Card title="Progress Reports">
        <p className="text-sm">Weekly change: {weeklyChange.toFixed(1)} kg</p>
        <p className="text-sm">Monthly change: {monthlyChange.toFixed(1)} kg</p>
        <ul className="mt-3 space-y-1 text-sm text-slate-600">
          {entries.map((entry) => (
            <li key={entry._id}>{entry.date}: {entry.weight} kg</li>
          ))}
          {!entries.length && <li className="text-slate-400">No entries yet.</li>}
        </ul>
      </Card>
    </div>
  )
}
