type ProgressBarProps = {
  label: string
  current: number
  target: number
}

export function ProgressBar({ label, current, target }: ProgressBarProps) {
  const percent = target ? Math.min(100, Math.round((current / target) * 100)) : 0

  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>
          {Math.round(current)} / {target}
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
