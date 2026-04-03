'use client'

import { motion } from 'framer-motion'
import { useStrategy, useStrategyRuns, useToggleStrategy } from '@/hooks/useStrategies'
import { useTrades } from '@/hooks/useTrades'

interface Props { strategyId: number }

export function StrategyDetailClient({ strategyId }: Props) {
  const { data: strategy } = useStrategy(strategyId)
  const { data: runs } = useStrategyRuns(strategyId)
  const { data: trades } = useTrades({ strategy_id: strategyId })
  const toggleMutation = useToggleStrategy()

  if (!strategy) return <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>{strategy.name}</h1>
          <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>{strategy.symbols.replace(/,/g, ' · ')}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toggleMutation.mutate({ id: strategy.id, enabled: !strategy.enabled })}
          className="px-4 py-2 rounded-lg text-sm font-medium"
          style={{
            background: strategy.enabled ? 'rgba(244, 63, 94, 0.15)' : 'rgba(16, 185, 129, 0.15)',
            color: strategy.enabled ? 'var(--accent-rose)' : 'var(--accent-emerald)',
            border: '1px solid',
            borderColor: strategy.enabled ? 'var(--accent-rose)' : 'var(--accent-emerald)',
          }}
        >{strategy.enabled ? 'Disable' : 'Enable'}</motion.button>
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Recent Runs</h2>
        {runs?.length ? (
          <div className="space-y-2">
            {runs.slice(0, 10).map((run, i) => (
              <motion.div
                key={run.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-2xl p-3 flex items-center justify-between"
                style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border-subtle)' }}
              >
                <div>
                  <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{run.symbol}</span>
                  <span className="text-xs ml-2" style={{ color: 'var(--text-muted)' }}>{new Date(run.created_at).toLocaleString()}</span>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-lg" style={{
                  background: run.decision === 'EXECUTE' ? 'rgba(16, 185, 129, 0.15)' :
                    run.decision === 'WAIT' ? 'rgba(245, 158, 11, 0.15)' : 'var(--void-elevated)',
                  color: run.decision === 'EXECUTE' ? 'var(--accent-emerald)' :
                    run.decision === 'WAIT' ? 'var(--accent-amber)' : 'var(--text-muted)',
                }}>{run.decision}</span>
              </motion.div>
            ))}
          </div>
        ) : <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>No runs yet</div>}
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Trades</h2>
        {trades?.length ? (
          <div className="space-y-2">
            {trades.map((trade, i) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-2xl p-3 flex items-center justify-between"
                style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border-subtle)' }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold" style={{ color: trade.direction === 'BUY' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{trade.direction}</span>
                  <span className="text-sm" style={{ color: 'var(--text-primary)' }}>{trade.symbol}</span>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>@ {trade.entry_price?.toFixed(5)}</span>
                </div>
                <div className="flex items-center gap-3">
                  {trade.pnl != null && (
                    <span className="text-sm font-[family-name:var(--font-mono)]" style={{ color: trade.pnl >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                      {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(5)}
                    </span>
                  )}
                  <span className="text-xs px-2 py-0.5 rounded-lg" style={{
                    background: trade.status === 'open' ? 'rgba(6, 182, 212, 0.15)' : 'var(--void-elevated)',
                    color: trade.status === 'open' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                  }}>{trade.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>No trades yet</div>}
      </div>
    </div>
  )
}
