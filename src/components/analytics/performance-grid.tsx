'use client'

import { usePerformance } from '@/hooks/useAnalytics'

export function PerformanceGrid() {
  const { data: perf, isLoading } = usePerformance()
  if (isLoading || !perf) return <div className="text-zinc-500">Loading...</div>

  const stats = [
    { label: 'Total Trades', value: perf.total_trades, color: 'text-white' },
    { label: 'Wins', value: perf.wins, color: 'text-green-400' },
    { label: 'Losses', value: perf.losses, color: 'text-red-400' },
    { label: 'Win Rate', value: `${perf.win_rate}%`, color: perf.win_rate >= 50 ? 'text-green-400' : 'text-red-400' },
    { label: 'Total P&L', value: perf.total_pnl >= 0 ? `+${perf.total_pnl.toFixed(5)}` : perf.total_pnl.toFixed(5), color: perf.total_pnl >= 0 ? 'text-green-400' : 'text-red-400' },
  ]

  return (
    <div className="grid grid-cols-5 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-zinc-900 rounded-lg p-4">
          <div className="text-xs text-zinc-500">{s.label}</div>
          <div className={`text-xl font-bold mt-1 ${s.color}`}>{s.value}</div>
        </div>
      ))}
    </div>
  )
}
