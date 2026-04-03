'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

import { EquityCurve } from '@/components/analytics/equity-curve'
import { PerformanceGrid } from '@/components/analytics/performance-grid'
import { useStrategies } from '@/hooks/useStrategies'
import { useTrades } from '@/hooks/useTrades'

export default function DashboardPage() {
  const { data: strategies } = useStrategies()
  const { data: trades } = useTrades()

  const activeStrategies = strategies?.filter((s) => s.enabled) ?? []
  const recentTrades = trades?.slice(0, 5) ?? []

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-end justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Dashboard
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>
            Live overview of trading performance
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border)' }}>
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-emerald)', boxShadow: '0 0 6px var(--accent-emerald-glow)' }} />
          <span className="text-xs font-[family-name:var(--font-mono)]" style={{ color: 'var(--text-secondary)' }}>
            {activeStrategies.length} active
          </span>
        </div>
      </motion.div>

      <PerformanceGrid />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Equity Curve</h2>
        </div>
        <EquityCurve />
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-5"
          style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Active Strategies</h2>
            <Link href="/strategies" className="text-xs transition-colors hover:opacity-80" style={{ color: 'var(--accent-cyan)' }}>View all →</Link>
          </div>
          {activeStrategies.length === 0 ? (
            <div className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>No active strategies</div>
          ) : (
            <div className="space-y-2">
              {activeStrategies.map((s) => (
                <Link key={s.id} href={`/strategies/${s.id}`}
                  className="flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:translate-x-1"
                  style={{ background: 'var(--void-elevated)', border: '1px solid var(--void-border-subtle)' }}
                >
                  <div>
                    <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{s.name}</div>
                    <div className="text-xs font-[family-name:var(--font-mono)] mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.symbols.replace(/,/g, ' · ')}</div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-lg" style={{ background: 'var(--accent-emerald-glow)', color: 'var(--accent-emerald)' }}>Running</span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl p-5"
          style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Recent Trades</h2>
            <Link href="/trades" className="text-xs transition-colors hover:opacity-80" style={{ color: 'var(--accent-cyan)' }}>View all →</Link>
          </div>
          {recentTrades.length === 0 ? (
            <div className="text-sm py-4 text-center" style={{ color: 'var(--text-muted)' }}>No trades yet</div>
          ) : (
            <div className="space-y-2">
              {recentTrades.map((t) => (
                <Link key={t.id} href={`/trades/${t.id}`}
                  className="flex items-center justify-between p-3 rounded-xl transition-all duration-200 hover:translate-x-1"
                  style={{ background: 'var(--void-elevated)', border: '1px solid var(--void-border-subtle)' }}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold font-[family-name:var(--font-mono)]"
                      style={{ color: t.direction === 'BUY' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                      {t.direction}
                    </span>
                    <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{t.symbol.replace('_', '/')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-[family-name:var(--font-mono)]"
                      style={{ color: (t.pnl ?? 0) >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                      {t.pnl != null ? `${t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(5)}` : '—'}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-lg"
                      style={{
                        background: t.status === 'open' ? 'var(--accent-cyan-glow)' : 'rgba(26, 26, 46, 0.5)',
                        color: t.status === 'open' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                      }}>
                      {t.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
