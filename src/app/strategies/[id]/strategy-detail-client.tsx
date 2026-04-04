'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useStrategy, useStrategyRuns, useToggleStrategy } from '@/hooks/useStrategies'
import { useTrades } from '@/hooks/useTrades'

/* ── pipeline node definitions ─────────────────────────────────────── */
const PIPELINE_NODES = [
  { label: 'Data Stream', icon: 'sensors', color: 'text-primary', bg: 'bg-primary/20' },
  { label: 'Analyst', icon: 'smart_toy', color: 'text-tertiary-fixed-dim', bg: 'bg-tertiary-fixed-dim/20' },
  { label: 'Evaluator', icon: 'psychology', color: 'text-secondary', bg: 'bg-secondary/20' },
  { label: 'Guardrail', icon: 'filter_alt', color: 'text-error', bg: 'bg-error/20' },
  { label: 'Execution', icon: 'rocket_launch', color: 'text-primary-container', bg: 'bg-primary-container/20' },
]

interface Props { strategyId: number }

export function StrategyDetailClient({ strategyId }: Props) {
  const { data: strategy } = useStrategy(strategyId)
  const { data: runs } = useStrategyRuns(strategyId)
  const { data: trades } = useTrades({ strategy_id: strategyId })
  const toggleMutation = useToggleStrategy()

  if (!strategy) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
      </div>
    )
  }

  const totalTrades = trades?.length ?? 0
  const winTrades = trades?.filter(t => (t.pnl ?? 0) > 0).length ?? 0
  const winRate = totalTrades > 0 ? ((winTrades / totalTrades) * 100).toFixed(1) : '---'
  const totalPnl = trades?.reduce((sum, t) => sum + (t.pnl ?? 0), 0) ?? 0
  const symbols = strategy.symbols.split(',').map(s => s.trim())

  return (
    <div className="space-y-10">
      {/* ── Hero Section ──────────────────────────────────────────── */}
      <div className="relative">
        {/* glow accent */}
        <div className="absolute -top-10 -left-10 w-48 h-48 rounded-full bg-primary-container/10 blur-[80px] pointer-events-none" />

        <div className="flex items-start justify-between gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Link
                href="/strategies"
                className="text-on-surface-variant hover:text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-lg">arrow_back</span>
              </Link>
              {strategy.enabled ? (
                <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-primary-container">
                  <span className="w-2 h-2 rounded-full bg-primary-container animate-pulse shadow-[0_0_8px_rgba(0,255,65,0.4)]" />
                  Active
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-on-surface-variant">
                  <span className="w-2 h-2 rounded-full bg-on-surface-variant" />
                  Inactive
                </span>
              )}
            </div>

            <h1 className="font-headline font-black text-5xl md:text-6xl tracking-tighter text-on-surface leading-none">
              {strategy.name}
            </h1>

            <div className="flex items-center gap-4 flex-wrap">
              {symbols.map(s => (
                <span
                  key={s}
                  className="px-2.5 py-1 rounded bg-surface-container-highest text-[10px] font-mono font-bold text-on-surface-variant uppercase tracking-wider"
                >
                  {s}
                </span>
              ))}
              <span className="text-[10px] font-mono text-outline">
                every {strategy.schedule_interval}s
              </span>
            </div>
          </div>

          {/* toggle + actions */}
          <div className="flex items-center gap-3 pt-2 flex-shrink-0">
            <Link
              href={`/strategies/${strategy.id}/flow`}
              className="px-4 py-2.5 rounded-lg text-xs font-bold bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">account_tree</span>
              Flow
            </Link>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => toggleMutation.mutate({ id: strategy.id, enabled: !strategy.enabled })}
              className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 ${
                strategy.enabled
                  ? 'bg-error-container text-on-error-container'
                  : 'bg-primary-container text-on-primary'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {strategy.enabled ? 'stop_circle' : 'play_arrow'}
              </span>
              {strategy.enabled ? 'Stop Strategy' : 'Start Strategy'}
            </motion.button>
          </div>
        </div>

        {/* hero stat cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10">
            <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">Total P/L</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className={`text-2xl font-headline font-bold ${totalPnl >= 0 ? 'text-primary' : 'text-error'}`}>
                {totalPnl >= 0 ? '+' : ''}{totalPnl.toFixed(2)}
              </span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10">
            <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">Win Rate</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-headline font-bold text-secondary">{winRate}%</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10">
            <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">Total Trades</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-headline font-bold text-on-surface">{totalTrades}</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant/10">
            <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">Runs</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-headline font-bold text-on-surface">{runs?.length ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Inline Pipeline Flow ─────────────────────────────────── */}
      <div className="bg-surface-container-low rounded-xl border border-outline-variant/10 p-6 overflow-x-auto">
        <div className="flex items-center gap-2 mb-5">
          <span className="material-symbols-outlined text-secondary text-lg">account_tree</span>
          <h2 className="font-headline text-sm font-bold tracking-tight uppercase">Decision Pipeline</h2>
          <div className="ml-auto flex items-center gap-2 px-2 py-1 bg-surface-container-highest rounded text-[10px] font-mono text-on-surface-variant">
            <span className={`w-1.5 h-1.5 rounded-full ${strategy.enabled ? 'bg-primary animate-pulse' : 'bg-on-surface-variant'}`} />
            <span>{strategy.enabled ? 'LIVE' : 'STOPPED'}</span>
          </div>
        </div>
        <div className="flex items-center gap-0 min-w-[600px]">
          {PIPELINE_NODES.map((node, i) => (
            <div key={node.label} className="flex items-center">
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-2.5 bg-surface-container-highest border border-outline-variant/20 rounded-lg px-4 py-3 min-w-[140px]"
              >
                <div className={`w-7 h-7 rounded ${node.bg} flex items-center justify-center`}>
                  <span className={`material-symbols-outlined text-base ${node.color}`}>{node.icon}</span>
                </div>
                <div>
                  <div className="text-xs font-semibold text-on-surface">{node.label}</div>
                  <div className={`text-[9px] font-mono ${strategy.enabled ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {strategy.enabled ? 'ACTIVE' : 'IDLE'}
                  </div>
                </div>
              </motion.div>
              {i < PIPELINE_NODES.length - 1 && (
                <div className="flex items-center px-1">
                  <svg width="32" height="12" viewBox="0 0 32 12" className="flex-shrink-0">
                    <line
                      x1="0" y1="6" x2="24" y2="6"
                      stroke={strategy.enabled ? '#00ff41' : '#3b4b37'}
                      strokeWidth="1.5"
                      strokeDasharray="4"
                      className={strategy.enabled ? 'animate-[dash_1s_linear_infinite]' : ''}
                    />
                    <polygon
                      points="24,2 32,6 24,10"
                      fill={strategy.enabled ? '#00ff41' : '#3b4b37'}
                    />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── Two-column: Runtime Logs + Trades ─────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* Runtime Logs (strategy runs) */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant text-base">terminal</span>
              <h2 className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant">Runtime Logs</h2>
            </div>
            <span className="text-[10px] font-mono text-outline">{runs?.length ?? 0} entries</span>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px] font-mono text-[11px]">
            {runs?.length ? (
              <div className="divide-y divide-outline-variant/5">
                {runs.slice(0, 20).map((run, i) => {
                  const ts = new Date(run.created_at)
                  const timeStr = ts.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
                  return (
                    <motion.div
                      key={run.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.02 }}
                      className="px-5 py-2.5 flex items-center gap-3 hover:bg-surface-container-low/50 transition-colors"
                    >
                      <span className="text-on-surface-variant/30 tabular-nums w-6 text-right select-none">{String(i + 1).padStart(2, '0')}</span>
                      <span className="text-secondary tabular-nums">[{timeStr}]</span>
                      <span className="text-on-surface font-medium">{run.symbol}</span>
                      <span className={`ml-auto px-2 py-0.5 rounded text-[10px] font-bold ${
                        run.decision === 'EXECUTE'
                          ? 'bg-primary/15 text-primary'
                          : run.decision === 'WAIT'
                            ? 'bg-secondary/15 text-secondary'
                            : 'bg-surface-container-highest text-on-surface-variant/60'
                      }`}>{run.decision}</span>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-on-surface-variant text-xs">
                No runs yet
              </div>
            )}
          </div>
        </div>

        {/* Trade List */}
        <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 flex flex-col">
          <div className="flex items-center justify-between px-5 py-3 border-b border-outline-variant/10">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-on-surface-variant text-base">swap_horiz</span>
              <h2 className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant">Trades</h2>
            </div>
            <Link
              href={`/trades?strategy_id=${strategyId}`}
              className="text-[10px] font-mono text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto max-h-[400px]">
            {trades?.length ? (
              <div className="divide-y divide-outline-variant/5">
                {trades.map((trade, i) => (
                  <motion.div
                    key={trade.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.02 }}
                    className="px-5 py-3 flex items-center justify-between hover:bg-surface-container-low/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold font-mono px-1.5 py-0.5 rounded ${
                        trade.direction === 'BUY'
                          ? 'bg-primary/15 text-primary'
                          : 'bg-error/15 text-error'
                      }`}>{trade.direction}</span>
                      <span className="text-sm font-medium text-on-surface">{trade.symbol}</span>
                      <span className="text-[10px] font-mono tabular-nums text-on-surface-variant/60">
                        @ {trade.entry_price?.toFixed(5)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {trade.pnl != null && (
                        <span className={`text-xs font-mono font-bold tabular-nums ${
                          trade.pnl >= 0 ? 'text-primary' : 'text-error'
                        }`}>
                          {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(5)}
                        </span>
                      )}
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                        trade.status === 'open'
                          ? 'bg-secondary/15 text-secondary'
                          : trade.status === 'closed'
                            ? 'bg-surface-container-highest text-on-surface-variant/60'
                            : 'bg-error/15 text-error'
                      }`}>{trade.status}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center h-32 text-on-surface-variant text-xs">
                No trades yet
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
