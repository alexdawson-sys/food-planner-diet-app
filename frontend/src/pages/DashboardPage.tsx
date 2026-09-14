import { Card } from '../components/Card'
import { ProgressBar } from '../components/ProgressBar'
import type { MacroTargets, Nutrition } from '../types'

type DashboardPageProps = {
  intake: Nutrition
  target: MacroTargets
}

export function DashboardPage({ intake, target }: DashboardPageProps) {
  return (
    <div className="space-y-4">
      <Card title="Daily Overview">
        <div className="grid gap-3">
          <ProgressBar label="Calories" current={intake.calories || 0} target={target.calories || 0} />
          <ProgressBar label="Protein (g)" current={intake.protein || 0} target={target.protein || 0} />
          <ProgressBar label="Carbs (g)" current={intake.carbs || 0} target={target.carbs || 0} />
          <ProgressBar label="Fats (g)" current={intake.fats || 0} target={target.fats || 0} />
        </div>
      </Card>
      <Card title="Micronutrients">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <p>Fiber: {Math.round(intake.micronutrients?.fiber || 0)} g</p>
          <p>Sodium: {Math.round(intake.micronutrients?.sodium || 0)} mg</p>
          <p>Sugar: {Math.round(intake.micronutrients?.sugar || 0)} g</p>
          <p>Potassium: {Math.round(intake.micronutrients?.potassium || 0)} mg</p>
        </div>
      </Card>
    </div>
  )
}
