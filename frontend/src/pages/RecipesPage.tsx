import { useState } from 'react'
import type { FormEvent } from 'react'
import { Card } from '../components/Card'

type Recipe = { _id: string; name: string; description?: string }

type RecipesPageProps = {
  recipes: Recipe[]
  favorites: Recipe[]
  onSearch: (search: string) => Promise<void>
  onCreate: (payload: { name: string; description: string }) => Promise<void>
  onFavorite: (id: string) => Promise<void>
}

export function RecipesPage({ recipes, favorites, onSearch, onCreate, onFavorite }: RecipesPageProps) {
  const [search, setSearch] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  async function handleCreate(event: FormEvent) {
    event.preventDefault()
    await onCreate({ name, description })
    setName('')
    setDescription('')
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card title="Recipe Database">
        <div className="mb-3 flex gap-2">
          <input
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Search recipes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="rounded-lg bg-primary px-3 py-2 text-white" onClick={() => onSearch(search)}>
            Search
          </button>
        </div>
        <ul className="space-y-2 text-sm">
          {recipes.map((recipe) => (
            <li key={recipe._id} className="rounded-lg border border-slate-200 p-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{recipe.name}</p>
                  <p className="text-slate-500">{recipe.description || 'No description'}</p>
                </div>
                <button className="text-primary" onClick={() => onFavorite(recipe._id)}>
                  ☆
                </button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Create Recipe + Favorites">
        <form className="space-y-2" onSubmit={handleCreate}>
          <input className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Recipe name" value={name} onChange={(e) => setName(e.target.value)} required />
          <textarea className="w-full rounded-lg border border-slate-300 px-3 py-2" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          <button className="w-full rounded-lg bg-primary px-3 py-2 text-white" type="submit">Save Recipe</button>
        </form>
        <h3 className="mt-4 text-sm font-semibold">Favorites</h3>
        <ul className="mt-1 list-disc pl-5 text-sm text-slate-600">
          {favorites.map((fav) => (
            <li key={fav._id}>{fav.name}</li>
          ))}
          {!favorites.length && <li className="list-none text-slate-400">No favorites yet</li>}
        </ul>
      </Card>
    </div>
  )
}
