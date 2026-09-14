import { Card } from '../components/Card'
import { ProgressBar } from '../components/ProgressBar'

type TrackingPageProps = {
  intake: { calories: number; protein: number; carbs: number; fats: number }
  target: { calories: number; protein: number; carbs: number; fats: number }
}

export function TrackingPage({ intake, target }: TrackingPageProps) {
  return (
    <Card title="Daily Intake vs Target">
      <div className="space-y-3">
        <ProgressBar label="Calories" current={intake.calories} target={target.calories} />
        <ProgressBar label="Protein" current={intake.protein} target={target.protein} />
        <ProgressBar label="Carbs" current={intake.carbs} target={target.carbs} />
        <ProgressBar label="Fats" current={intake.fats} target={target.fats} />
      </div>
    </Card>
  )
}
