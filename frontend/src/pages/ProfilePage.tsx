import { useState } from 'react'
import type { FormEvent } from 'react'
import { Card } from '../components/Card'
import type { User } from '../types'

type ProfilePageProps = {
  user: User
  onSave: (updates: User['profile']) => Promise<void>
}

export function ProfilePage({ user, onSave }: ProfilePageProps) {
  const [profile, setProfile] = useState<User['profile']>(user.profile || {})

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    await onSave(profile)
  }

  return (
    <Card title="Profile & Targets">
      <form className="grid grid-cols-2 gap-3" onSubmit={handleSubmit}>
        {(['height', 'weight', 'age'] as const).map((field) => (
          <input
            key={field}
            className="rounded-lg border border-slate-300 px-3 py-2"
            type="number"
            placeholder={field}
            value={profile[field] || ''}
            onChange={(e) => setProfile((old) => ({ ...old, [field]: Number(e.target.value) }))}
          />
        ))}
        <select
          className="rounded-lg border border-slate-300 px-3 py-2"
          value={profile.gender || 'other'}
          onChange={(e) => setProfile((old) => ({ ...old, gender: e.target.value as User['profile']['gender'] }))}
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
        <select
          className="rounded-lg border border-slate-300 px-3 py-2"
          value={profile.activityLevel || 'moderate'}
          onChange={(e) =>
            setProfile((old) => ({ ...old, activityLevel: e.target.value as User['profile']['activityLevel'] }))
          }
        >
          <option value="sedentary">Sedentary</option>
          <option value="light">Light</option>
          <option value="moderate">Moderate</option>
          <option value="active">Active</option>
          <option value="very_active">Very Active</option>
        </select>
        <select
          className="rounded-lg border border-slate-300 px-3 py-2"
          value={profile.goal || 'maintain'}
          onChange={(e) => setProfile((old) => ({ ...old, goal: e.target.value as User['profile']['goal'] }))}
        >
          <option value="lose">Lose</option>
          <option value="maintain">Maintain</option>
          <option value="gain">Gain</option>
        </select>
        <button className="col-span-2 rounded-lg bg-primary px-3 py-2 font-medium text-white" type="submit">
          Save profile
        </button>
      </form>
      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <p>Calories: {user.targets?.calories ?? 0}</p>
        <p>Protein: {user.targets?.protein ?? 0}g</p>
        <p>Carbs: {user.targets?.carbs ?? 0}g</p>
        <p>Fats: {user.targets?.fats ?? 0}g</p>
      </div>
    </Card>
  )
}
