'use client'

import { useStrategy, useStrategyRuns, useToggleStrategy } from '@/hooks/useStrategies'
import { useTrades } from '@/hooks/useTrades'

interface Props { strategyId: number }

export function StrategyDetailClient({ strategyId }: Props) {
  const { data: strategy } = useStrategy(strategyId)
  const { data: runs } = useStrategyRuns(strategyId)
  const { data: trades } = useTrades({ strategy_id: strategyId })
  const toggleMutation = useToggleStrategy()

  if (!strategy) return <div className="text-zinc-500">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{strategy.name}</h1>
          <p className="text-zinc-500 mt-1">{strategy.symbols.replace(/,/g, ' · ')}</p>
        </div>
        <button
          onClick={() => toggleMutation.mutate({ id: strategy.id, enabled: !strategy.enabled })}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            strategy.enabled ? 'bg-red-900 text-red-300 hover:bg-red-800' : 'bg-green-900 text-green-300 hover:bg-green-800'
          }`}
        >{strategy.enabled ? 'Disable' : 'Enable'}</button>
      </div>

      <div>
        <h2 className="text-sm font-medium text-zinc-400 mb-3">Recent Runs</h2>
        {runs?.length ? (
          <div className="space-y-2">
            {runs.slice(0, 10).map((run) => (
              <div key={run.id} className="bg-zinc-900 rounded-lg p-3 flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium">{run.symbol}</span>
                  <span className="text-xs text-zinc-500 ml-2">{new Date(run.created_at).toLocaleString()}</span>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${
                  run.decision === 'EXECUTE' ? 'bg-green-900 text-green-300' :
                  run.decision === 'WAIT' ? 'bg-yellow-900 text-yellow-300' : 'bg-zinc-800 text-zinc-500'
                }`}>{run.decision}</span>
              </div>
            ))}
          </div>
        ) : <div className="text-zinc-500 text-sm">No runs yet</div>}
      </div>

      <div>
        <h2 className="text-sm font-medium text-zinc-400 mb-3">Trades</h2>
        {trades?.length ? (
          <div className="space-y-2">
            {trades.map((trade) => (
              <div key={trade.id} className="bg-zinc-900 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-bold ${trade.direction === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>{trade.direction}</span>
                  <span className="text-sm">{trade.symbol}</span>
                  <span className="text-xs text-zinc-500">@ {trade.entry_price?.toFixed(5)}</span>
                </div>
                <div className="flex items-center gap-3">
                  {trade.pnl != null && (
                    <span className={`text-sm font-mono ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(5)}
                    </span>
                  )}
                  <span className={`text-xs px-2 py-0.5 rounded ${trade.status === 'open' ? 'bg-blue-900 text-blue-300' : 'bg-zinc-800 text-zinc-500'}`}>{trade.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : <div className="text-zinc-500 text-sm">No trades yet</div>}
      </div>
    </div>
  )
}
