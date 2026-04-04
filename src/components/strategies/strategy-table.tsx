'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { useStrategies, useToggleStrategy } from '@/hooks/useStrategies'

export function StrategyTable() {
  const { data: strategies, isLoading } = useStrategies()
  const toggleMutation = useToggleStrategy()

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-16 rounded-xl animate-pulse bg-surface-container-lowest" />
        ))}
      </div>
    )
  }

  if (!strategies?.length) {
    return (
      <div className="rounded-xl p-12 text-center bg-surface-container-lowest border border-outline-variant/10">
        <div className="text-4xl mb-3">⬢</div>
        <div className="text-sm text-on-surface-variant">No strategies yet</div>
        <div className="text-xs mt-1 text-on-surface-variant/60">Create your first strategy to start trading</div>
      </div>
    )
  }

  return (
    <div className="rounded-xl overflow-hidden bg-surface-container-lowest border border-outline-variant/10">
      <div className="grid grid-cols-[1fr_1fr_100px_100px_80px_60px] gap-4 px-5 py-3 text-[11px] uppercase tracking-wider text-on-surface-variant border-b border-outline-variant/10">
        <div>Strategy</div>
        <div>Symbols</div>
        <div>Interval</div>
        <div>Status</div>
        <div>Enabled</div>
        <div></div>
      </div>
      {strategies.map((s, i) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="grid grid-cols-[1fr_1fr_100px_100px_80px_60px] gap-4 items-center px-5 py-4 transition-all duration-200 hover:bg-surface-container-low border-b border-outline-variant/10 last:border-b-0"
        >
          <Link href={`/strategies/${s.id}`} className="text-sm font-medium text-on-surface hover:text-primary hover:underline transition-colors">
            {s.name}
          </Link>
          <div className="text-xs font-mono text-on-surface-variant">
            {s.symbols.replace(/,/g, ' · ')}
          </div>
          <div className="text-xs font-mono tabular-nums text-on-surface-variant/60">
            {s.schedule_interval}s
          </div>
          <span className={`text-xs px-2.5 py-1 rounded-lg w-fit ${
            s.enabled
              ? 'bg-primary/20 text-primary'
              : 'bg-surface-container-highest text-on-surface-variant/60'
          }`}>
            {s.enabled ? 'Active' : 'Inactive'}
          </span>
          <button
            onClick={() => toggleMutation.mutate({ id: s.id, enabled: !s.enabled })}
            className={`w-11 h-6 rounded-full transition-all duration-300 relative ${
              s.enabled ? 'bg-primary-container' : 'bg-surface-container-highest'
            }`}
          >
            <motion.div
              animate={{ x: s.enabled ? 22 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white"
            />
          </button>
          <Link href={`/strategies/${s.id}/flow`} className="text-xs text-secondary transition-colors hover:text-secondary/70">
            Flow →
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
