import { useState } from 'react'
import type { FormEvent } from 'react'
import { Card } from '../components/Card'

type ShoppingList = {
  _id: string
  name: string
  items: Array<{ _id: string; name: string; quantity: number; unit: string; purchased: boolean }>
}

type ShoppingListPageProps = {
  lists: ShoppingList[]
  onCreateManual: (name: string, itemName: string) => Promise<void>
  onGenerate: (startDate: string, endDate: string) => Promise<void>
  onToggle: (listId: string, itemId: string) => Promise<void>
}

export function ShoppingListPage({ lists, onCreateManual, onGenerate, onToggle }: ShoppingListPageProps) {
  const [name, setName] = useState('Manual List')
  const [itemName, setItemName] = useState('')
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10))
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10))

  async function handleManualSubmit(event: FormEvent) {
    event.preventDefault()
    await onCreateManual(name, itemName)
    setItemName('')
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Create Shopping Lists">
        <form className="space-y-2" onSubmit={handleManualSubmit}>
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} placeholder="List name" />
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="First item" required />
          <button className="w-full rounded-lg bg-primary px-3 py-2 text-white" type="submit">Create Manual List</button>
        </form>
        <div className="mt-4 space-y-2">
          <h3 className="text-sm font-semibold">Generate from Meal Plans</h3>
          <div className="grid grid-cols-2 gap-2">
            <input className="rounded-lg border border-slate-300 px-3 py-2" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            <input className="rounded-lg border border-slate-300 px-3 py-2" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
          <button className="w-full rounded-lg border border-primary px-3 py-2 text-primary" onClick={() => onGenerate(startDate, endDate)}>
            Generate
          </button>
        </div>
      </Card>
      <Card title="Shopping Lists (Check Off Items)">
        <div className="space-y-3 text-sm">
          {lists.map((list) => (
            <div key={list._id} className="rounded-lg border border-slate-200 p-2">
              <p className="font-medium">{list.name}</p>
              <ul className="mt-1 space-y-1">
                {list.items.map((item) => (
                  <li key={item._id}>
                    <button className={`mr-2 ${item.purchased ? 'text-green-600' : 'text-slate-500'}`} onClick={() => onToggle(list._id, item._id)}>
                      {item.purchased ? '✓' : '○'}
                    </button>
                    {item.name} ({item.quantity} {item.unit})
                  </li>
                ))}
              </ul>
            </div>
          ))}
          {!lists.length && <p className="text-slate-400">No lists yet.</p>}
        </div>
      </Card>
    </div>
  )
}
