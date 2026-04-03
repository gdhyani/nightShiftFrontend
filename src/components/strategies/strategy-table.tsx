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
          <div key={i} className="h-16 rounded-2xl animate-pulse" style={{ background: 'var(--void-surface)' }} />
        ))}
      </div>
    )
  }

  if (!strategies?.length) {
    return (
      <div className="rounded-2xl p-12 text-center" style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border)' }}>
        <div className="text-4xl mb-3">⬢</div>
        <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>No strategies yet</div>
        <div className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>Create your first strategy to start trading</div>
      </div>
    )
  }

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border)' }}>
      <div className="grid grid-cols-[1fr_1fr_100px_100px_80px_60px] gap-4 px-5 py-3 text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--void-border-subtle)' }}>
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
          className="grid grid-cols-[1fr_1fr_100px_100px_80px_60px] gap-4 items-center px-5 py-4 transition-all duration-200 hover:brightness-125"
          style={{ borderBottom: '1px solid var(--void-border-subtle)' }}
        >
          <Link href={`/strategies/${s.id}`} className="text-sm font-medium hover:underline" style={{ color: 'var(--text-primary)' }}>
            {s.name}
          </Link>
          <div className="text-xs font-[family-name:var(--font-mono)]" style={{ color: 'var(--text-secondary)' }}>
            {s.symbols.replace(/,/g, ' · ')}
          </div>
          <div className="text-xs font-[family-name:var(--font-mono)]" style={{ color: 'var(--text-muted)' }}>
            {s.schedule_interval}s
          </div>
          <span className="text-xs px-2.5 py-1 rounded-lg w-fit"
            style={{
              background: s.enabled ? 'var(--accent-emerald-glow)' : 'rgba(26, 26, 46, 0.5)',
              color: s.enabled ? 'var(--accent-emerald)' : 'var(--text-muted)',
            }}>
            {s.enabled ? 'Active' : 'Inactive'}
          </span>
          <button
            onClick={() => toggleMutation.mutate({ id: s.id, enabled: !s.enabled })}
            className="w-11 h-6 rounded-full transition-all duration-300 relative"
            style={{
              background: s.enabled ? 'var(--accent-emerald)' : 'var(--void-border)',
              boxShadow: s.enabled ? '0 0 12px var(--accent-emerald-glow)' : 'none',
            }}
          >
            <motion.div
              animate={{ x: s.enabled ? 22 : 2 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="absolute top-1 w-4 h-4 rounded-full bg-white"
            />
          </button>
          <Link href={`/strategies/${s.id}/flow`} className="text-xs transition-colors hover:opacity-80" style={{ color: 'var(--accent-cyan)' }}>
            Flow →
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
