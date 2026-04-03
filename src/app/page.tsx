'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { PerformanceGrid } from '@/components/analytics/performance-grid'
import { EquityCurve } from '@/components/analytics/equity-curve'
import { useStrategies } from '@/hooks/useStrategies'
import { useTrades } from '@/hooks/useTrades'

export default function DashboardPage() {
  const { data: strategies } = useStrategies()
  const { data: trades } = useTrades()

  const activeStrategies = strategies?.filter((s) => s.enabled) ?? []
  const recentTrades = trades?.slice(0, 5) ?? []

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-zinc-500 mt-1">Live overview of trading performance</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <PerformanceGrid />
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h2 className="text-sm font-medium text-zinc-400 mb-3">Equity Curve</h2>
        <EquityCurve />
      </motion.div>

      <div className="grid grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-zinc-400">Active Strategies</h2>
            <Link href="/strategies" className="text-xs text-zinc-500 hover:text-white transition-colors">View all</Link>
          </div>
          {activeStrategies.length === 0 ? (
            <div className="text-zinc-500 text-sm">No active strategies</div>
          ) : (
            <div className="space-y-2">
              {activeStrategies.map((s) => (
                <div key={s.id} className="bg-zinc-900 rounded-lg p-3 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">{s.name}</div>
                    <div className="text-xs text-zinc-500">{s.symbols}</div>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded bg-green-900 text-green-300">Active</span>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-medium text-zinc-400">Recent Trades</h2>
            <Link href="/trades" className="text-xs text-zinc-500 hover:text-white transition-colors">View all</Link>
          </div>
          {recentTrades.length === 0 ? (
            <div className="text-zinc-500 text-sm">No trades yet</div>
          ) : (
            <div className="space-y-2">
              {recentTrades.map((t) => (
                <Link key={t.id} href={`/trades/${t.id}`} className="bg-zinc-900 rounded-lg p-3 flex items-center justify-between hover:bg-zinc-800 transition-colors block">
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold ${t.direction === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>{t.direction}</span>
                    <span className="text-sm">{t.symbol.replace('_', '/')}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-mono ${(t.pnl ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {t.pnl != null ? `${t.pnl >= 0 ? '+' : ''}${t.pnl.toFixed(5)}` : '--'}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      t.status === 'open' ? 'bg-blue-900 text-blue-300' : 'bg-zinc-800 text-zinc-400'
                    }`}>{t.status}</span>
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
