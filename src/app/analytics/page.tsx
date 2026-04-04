import { EquityCurve } from '@/components/analytics/equity-curve'
import { PerformanceGrid } from '@/components/analytics/performance-grid'

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline font-bold text-3xl uppercase tracking-tight text-on-surface">Analytics</h1>
        <p className="mt-1 text-on-surface-variant text-sm">Performance metrics and equity curve</p>
      </div>
      <PerformanceGrid />
      <div>
        <h2 className="text-on-surface-variant text-[11px] uppercase tracking-wider font-mono mb-3">Equity Curve</h2>
        <EquityCurve />
      </div>
    </div>
  )
}
