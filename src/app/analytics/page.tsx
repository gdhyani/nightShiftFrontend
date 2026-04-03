import { EquityCurve } from '@/components/analytics/equity-curve'
import { PerformanceGrid } from '@/components/analytics/performance-grid'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Analytics</h1>
        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Performance metrics and equity curve</p>
      </div>
      <PerformanceGrid />
      <div>
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Equity Curve</h2>
        <EquityCurve />
      </div>
    </div>
  )
}
