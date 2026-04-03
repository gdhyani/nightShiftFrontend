import { EquityCurve } from '@/components/analytics/equity-curve'
import { PerformanceGrid } from '@/components/analytics/performance-grid'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-zinc-500 mt-1">Performance metrics and equity curve</p>
      </div>
      <PerformanceGrid />
      <div>
        <h2 className="text-sm font-medium text-zinc-400 mb-3">Equity Curve</h2>
        <EquityCurve />
      </div>
    </div>
  )
}
