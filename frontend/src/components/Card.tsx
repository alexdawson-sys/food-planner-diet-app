import type { PropsWithChildren } from 'react'

type CardProps = PropsWithChildren<{ title: string }>

export function Card({ title, children }: CardProps) {
  return (
    <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">{title}</h2>
      {children}
    </section>
  )
}
