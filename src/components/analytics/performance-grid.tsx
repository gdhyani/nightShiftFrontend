'use client'

import { motion } from 'framer-motion'

import { usePerformance } from '@/hooks/useAnalytics'

const colorMap = {
  secondary: 'text-secondary',
  primary: 'text-primary',
  error: 'text-error',
} as const

export function PerformanceGrid() {
  const { data: perf, isLoading } = usePerformance()

  if (isLoading || !perf) {
    return (
      <div className="grid grid-cols-5 gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-24 rounded-xl animate-pulse bg-surface-container-lowest" />
        ))}
      </div>
    )
  }

  const stats: { label: string; value: number; color: keyof typeof colorMap; format: string }[] = [
    { label: 'Total Trades', value: perf.total_trades, color: 'secondary', format: 'number' },
    { label: 'Wins', value: perf.wins, color: 'primary', format: 'number' },
    { label: 'Losses', value: perf.losses, color: 'error', format: 'number' },
    { label: 'Win Rate', value: perf.win_rate, color: perf.win_rate >= 50 ? 'primary' : 'error', format: 'percent' },
    { label: 'Total P&L', value: perf.total_pnl, color: perf.total_pnl >= 0 ? 'primary' : 'error', format: 'pnl' },
  ]

  return (
    <div className="grid grid-cols-5 gap-3">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06, duration: 0.4 }}
          className="bg-surface-container-lowest rounded-xl p-5"
        >
          <div className="text-on-surface-variant text-[10px] uppercase tracking-[0.2em] font-mono">{s.label}</div>
          <div className={`font-headline font-bold text-2xl tabular-nums mt-2 ${colorMap[s.color]}`}>
            {s.format === 'percent' ? `${s.value}%` :
             s.format === 'pnl' ? `${s.value >= 0 ? '+' : ''}${s.value.toFixed(5)}` :
             s.value}
          </div>
        </motion.div>
      ))}
    </div>
  )
}
