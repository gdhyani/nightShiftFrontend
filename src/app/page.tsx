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
          <h1 className="text-3xl font-headline font-bold uppercase tracking-tight text-on-surface">
            Dashboard
          </h1>
          <p className="text-sm mt-1 text-on-surface-variant font-light">
            Live overview of trading performance
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
          <div className="w-1.5 h-1.5 rounded-full bg-primary-container shadow-[0_0_6px_rgba(0,255,65,0.4)]" />
          <span className="text-xs font-mono text-primary">
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
          <h2 className="text-[10px] uppercase tracking-[0.2em] font-mono text-on-surface-variant">Equity Curve</h2>
        </div>
        <EquityCurve />
      </motion.div>

      <div className="grid grid-cols-2 gap-4">
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-mono text-on-surface-variant">Active Strategies</h2>
            <Link href="/strategies" className="text-xs text-secondary hover:text-secondary-container transition-colors">View all &rarr;</Link>
          </div>
          {activeStrategies.length === 0 ? (
            <div className="text-sm py-4 text-center text-on-surface-variant">No active strategies</div>
          ) : (
            <div className="space-y-2">
              {activeStrategies.map((s) => (
                <Link key={s.id} href={`/strategies/${s.id}`}
                  className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl transition-all duration-200 hover:bg-surface-container-low hover:translate-x-1 border border-outline-variant/10"
                >
                  <div>
                    <div className="text-sm font-medium text-on-surface">{s.name}</div>
                    <div className="text-xs font-mono mt-0.5 text-on-surface-variant">{s.symbols.replace(/,/g, ' · ')}</div>
                  </div>
                  <span className="bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-widest">Running</span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[10px] uppercase tracking-[0.2em] font-mono text-on-surface-variant">Recent Trades</h2>
            <Link href="/trades" className="text-xs text-secondary hover:text-secondary-container transition-colors">View all &rarr;</Link>
          </div>
          {recentTrades.length === 0 ? (
            <div className="text-sm py-4 text-center text-on-surface-variant">No trades yet</div>
          ) : (
            <div className="space-y-2">
              {recentTrades.map((t) => (
                <Link key={t.id} href={`/trades/${t.id}`}
                  className="flex items-center justify-between p-4 bg-surface-container-lowest rounded-xl transition-all duration-200 hover:bg-surface-container-low hover:translate-x-1 border border-outline-variant/10"
                >
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold font-mono ${t.direction === 'BUY' ? 'text-primary-container' : 'text-error'}`}>
                      {t.direction}
                    </span>
                    <span className="text-sm text-on-surface">{t.symbol.replace('_', '/')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-mono tabular-nums ${(t.pnl ?? 0) >= 0 ? 'text-primary-container' : 'text-error'}`}>
                      {t.pnl != null ? `${t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(5)}` : '—'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-mono uppercase ${
                      t.status === 'open'
                        ? 'bg-secondary/20 text-secondary'
                        : 'bg-surface-container-high text-on-surface-variant'
                    }`}>
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
