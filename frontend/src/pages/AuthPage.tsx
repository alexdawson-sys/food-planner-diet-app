import { useState } from 'react'
import type { FormEvent } from 'react'

type AuthPageProps = {
  onLogin: (email: string, password: string) => Promise<void>
  onRegister: (name: string, email: string, password: string) => Promise<void>
}

export function AuthPage({ onLogin, onRegister }: AuthPageProps) {
  const [isRegister, setIsRegister] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setError('')
    try {
      if (isRegister) {
        await onRegister(name, email, password)
      } else {
        await onLogin(email, password)
      }
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Authentication failed')
    }
  }

  return (
    <div className="mx-auto mt-16 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg ring-1 ring-slate-200">
      <h1 className="mb-1 text-2xl font-bold">Food Planner & Diet Tracker</h1>
      <p className="mb-6 text-sm text-slate-600">Simple to use, professional daily nutrition tracking.</p>
      <form className="space-y-3" onSubmit={handleSubmit}>
        {isRegister && (
          <input
            className="w-full rounded-lg border border-slate-300 px-3 py-2"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="w-full rounded-lg bg-primary px-3 py-2 font-medium text-white" type="submit">
          {isRegister ? 'Create account' : 'Sign in'}
        </button>
      </form>
      <button className="mt-4 text-sm text-primary" onClick={() => setIsRegister((v) => !v)}>
        {isRegister ? 'Already have an account? Sign in' : 'Need an account? Register'}
      </button>
    </div>
  )
}
