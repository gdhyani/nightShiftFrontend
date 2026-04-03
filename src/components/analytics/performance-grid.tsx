'use client'

import { motion } from 'framer-motion'

import { usePerformance } from '@/hooks/useAnalytics'

export function PerformanceGrid() {
  const { data: perf, isLoading } = usePerformance()

  if (isLoading || !perf) {
    return (
      <div className="grid grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl animate-pulse" style={{ background: 'var(--void-surface)' }} />
        ))}
      </div>
    )
  }

  const stats = [
    { label: 'Total Trades', value: perf.total_trades, accent: 'var(--accent-cyan)', format: 'number' },
    { label: 'Wins', value: perf.wins, accent: 'var(--accent-emerald)', format: 'number' },
    { label: 'Losses', value: perf.losses, accent: 'var(--accent-rose)', format: 'number' },
    { label: 'Win Rate', value: perf.win_rate, accent: perf.win_rate >= 50 ? 'var(--accent-emerald)' : 'var(--accent-rose)', format: 'percent' },
    { label: 'Total P&L', value: perf.total_pnl, accent: perf.total_pnl >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)', format: 'pnl' },
  ]

  return (
    <div className="grid grid-cols-5 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          className="relative rounded-2xl p-4 overflow-hidden"
          style={{
            background: 'var(--void-surface)',
            border: '1px solid var(--void-border)',
          }}
        >
          <div className="absolute top-0 left-4 right-4 h-[2px] rounded-full" style={{ background: s.accent }} />
          <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{s.label}</div>
          <div
            className="text-2xl font-semibold mt-2 font-[family-name:var(--font-mono)]"
            style={{ color: s.accent }}
          >
            {s.format === 'percent' ? `${s.value}%` :
             s.format === 'pnl' ? `${s.value >= 0 ? '+' : ''}${s.value.toFixed(5)}` :
             s.value}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
