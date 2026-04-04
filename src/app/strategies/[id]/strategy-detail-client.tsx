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

  if (!strategy) return <div className="text-on-surface-variant">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline font-bold text-3xl text-on-surface">{strategy.name}</h1>
          <p className="mt-1 text-on-surface-variant font-mono text-sm">{strategy.symbols.replace(/,/g, ' · ')}</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => toggleMutation.mutate({ id: strategy.id, enabled: !strategy.enabled })}
          className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${
            strategy.enabled
              ? 'bg-error/10 text-error border-error/40'
              : 'bg-primary/20 text-primary border-primary-container/40'
          }`}
        >{strategy.enabled ? 'Disable' : 'Enable'}</motion.button>
      </div>

      <div>
        <h2 className="text-[11px] uppercase tracking-wider font-medium mb-3 text-on-surface-variant">Recent Runs</h2>
        {runs?.length ? (
          <div className="space-y-1">
            {runs.slice(0, 10).map((run, i) => (
              <motion.div
                key={run.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-lg px-3 py-2 flex items-center justify-between bg-surface-container-lowest border border-outline-variant/10 font-mono text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="text-on-surface-variant/40 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                  <span className="text-on-surface font-medium">{run.symbol}</span>
                  <span className="text-on-surface-variant/60 tabular-nums">{new Date(run.created_at).toLocaleString()}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-md font-bold ${
                  run.decision === 'EXECUTE'
                    ? 'bg-primary/20 text-primary'
                    : run.decision === 'WAIT'
                      ? 'bg-secondary/20 text-secondary'
                      : 'bg-surface-container-highest text-on-surface-variant/60'
                }`}>{run.decision}</span>
              </motion.div>
            ))}
          </div>
        ) : <div className="text-sm text-on-surface-variant">No runs yet</div>}
      </div>

      <div>
        <h2 className="text-[11px] uppercase tracking-wider font-medium mb-3 text-on-surface-variant">Trades</h2>
        {trades?.length ? (
          <div className="space-y-1">
            {trades.map((trade, i) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="rounded-lg px-3 py-2 flex items-center justify-between bg-surface-container-lowest border border-outline-variant/10"
              >
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold font-mono ${
                    trade.direction === 'BUY' ? 'text-primary' : 'text-error'
                  }`}>{trade.direction}</span>
                  <span className="text-sm text-on-surface">{trade.symbol}</span>
                  <span className="text-xs font-mono tabular-nums text-on-surface-variant/60">@ {trade.entry_price?.toFixed(5)}</span>
                </div>
                <div className="flex items-center gap-3">
                  {trade.pnl != null && (
                    <span className={`text-sm font-mono tabular-nums ${
                      trade.pnl >= 0 ? 'text-primary' : 'text-error'
                    }`}>
                      {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(5)}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded-md ${
                    trade.status === 'open'
                      ? 'bg-secondary/20 text-secondary'
                      : 'bg-surface-container-highest text-on-surface-variant/60'
                  }`}>{trade.status}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : <div className="text-sm text-on-surface-variant">No trades yet</div>}
      </div>
    </div>
  )
}
