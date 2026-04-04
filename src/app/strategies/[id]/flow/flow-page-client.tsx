'use client'

import Link from 'next/link'
import { PipelineFlow } from '@/components/flow/pipeline-flow'
import { useStrategy, useStrategyRuns } from '@/hooks/useStrategies'
import { useTrades } from '@/hooks/useTrades'
import type { StrategyRun, Trade } from '@/types/api'

interface Props { strategyId: number }

export function FlowPageClient({ strategyId }: Props) {
  const { data: strategy } = useStrategy(strategyId)
  const { data: runs } = useStrategyRuns(strategyId)
  const { data: trades } = useTrades({ strategy_id: strategyId })
  const latestRun = (runs?.[0] ?? null) as StrategyRun | null
  const latestTrade = (trades?.[0] ?? null) as Trade | null

  return (
    <div className="flex flex-col xl:flex-row h-[calc(100vh-7rem)] gap-0">
      {/* Main pipeline area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-outline-variant/10">
          <div className="flex items-center gap-4">
            <Link
              href={`/strategies/${strategyId}`}
              className="text-on-surface-variant hover:text-primary transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold font-headline text-primary tracking-tight">
                {strategy?.name ?? 'Strategy'} — Pipeline Flow
              </h1>
              <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-0.5">
                Live decision pipeline visualization
              </p>
            </div>
          </div>
          {latestRun && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-surface-container-highest rounded-lg text-[10px] font-mono text-on-surface-variant">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse" />
              <span>{latestRun.decision === 'EXECUTE' ? 'EXECUTED' : latestRun.decision}</span>
            </div>
          )}
        </div>

        {/* Pipeline canvas */}
        <div className="flex-1 overflow-hidden">
          <PipelineFlow strategyId={strategyId} />
        </div>

        {/* Bottom terminal log */}
        <FlowTerminal runs={runs ?? []} />
      </div>

      {/* Trade detail sidebar */}
      {latestRun && (
        <TradeDetailSidebar run={latestRun} trade={latestTrade} symbol={strategy?.symbols ?? ''} />
      )}
    </div>
  )
}

/* ── Flow Terminal Log ───────────────────────────────────────────────── */
function FlowTerminal({ runs }: { runs: StrategyRun[] }) {
  const recent = runs.slice(0, 4)
  return (
    <div className="px-6 py-3 bg-surface-container-lowest/80 backdrop-blur-md border-t border-outline-variant/10">
      <div className="font-mono text-[11px] text-on-surface-variant flex flex-col gap-1 h-14 overflow-hidden">
        {recent.length === 0 && (
          <div className="flex gap-2 text-on-surface-variant/50 italic">No pipeline executions yet.</div>
        )}
        {recent.map((run) => {
          const time = new Date(run.created_at).toLocaleTimeString('en-US', { hour12: false })
          const stages = ((run.stages as Record<string, unknown>)?.stages ?? []) as Array<{ agent: string; output?: Record<string, unknown> }>
          const lastAgent = stages[stages.length - 1]
          return (
            <div key={run.id} className="flex gap-2">
              <span className="text-secondary">[{time}]</span>
              <span className={run.decision === 'EXECUTE' ? 'text-primary-container font-bold' : 'text-on-surface-variant'}>
                {lastAgent?.agent?.toUpperCase() ?? 'PIPELINE'}: {run.decision} — {run.symbol}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── Trade Detail Sidebar ────────────────────────────────────────────── */
function TradeDetailSidebar({
  run,
  trade,
  symbol,
}: {
  run: StrategyRun
  trade: Trade | null
  symbol: string
}) {
  const stages = ((run.stages as Record<string, unknown>)?.stages ?? []) as Array<{
    agent: string
    output?: Record<string, unknown>
  }>

  return (
    <aside className="w-full xl:w-96 bg-surface-container p-6 overflow-y-auto flex flex-col gap-5 border-l border-outline-variant/10 flex-shrink-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-headline font-bold text-lg uppercase tracking-tight">Trade Detail</h3>
        {trade && (
          <span className="bg-primary/10 text-primary px-2 py-1 rounded text-[10px] font-bold">
            #{trade.id}
          </span>
        )}
      </div>

      {/* Asset Focus */}
      <div className="flex items-center gap-4 bg-surface-container-high p-4 rounded-xl border border-outline-variant/10">
        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
          <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold">{symbol || run.symbol}</div>
          <div className="text-xs text-on-surface-variant">Pipeline Run</div>
        </div>
        <div className="text-right">
          <div className={`text-sm font-mono font-bold ${run.decision === 'EXECUTE' ? 'text-primary-container' : run.decision === 'WAIT' ? 'text-amber-400' : 'text-on-surface-variant'}`}>
            {run.decision}
          </div>
        </div>
      </div>

      {/* Trade prices grid */}
      {trade && (
        <div className="grid grid-cols-2 gap-3">
          <PriceCell label="Entry Price" value={trade.entry_price} />
          <PriceCell label="Exit Price" value={trade.exit_price} highlight />
          <PriceCell label="Stop Loss" value={trade.stop_loss} border="border-l-2 border-error" />
          <PriceCell label="Take Profit" value={trade.take_profit} border="border-l-2 border-primary" />
          <div className="col-span-2 bg-surface-container-low p-3 rounded-lg flex justify-between items-center border border-outline-variant/5">
            <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">P/L</span>
            <span className={`text-sm font-mono font-bold ${(trade.pnl ?? 0) >= 0 ? 'text-primary-container' : 'text-error'}`}>
              {trade.pnl != null ? `${trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}` : '—'}
            </span>
          </div>
        </div>
      )}

      {/* Rationale Engine */}
      <div className="space-y-4">
        <div className="text-xs font-bold text-tertiary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          RATIONALE ENGINE
        </div>
        <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant/30">
          {stages.map((stage, i) => {
            const decision = (stage.output as Record<string, unknown>)?.decision as string | undefined
            const confidence = (stage.output as Record<string, unknown>)?.confidence as number | undefined
            const reasoning = (stage.output as Record<string, unknown>)?.reasoning as string | undefined
            const colors = ['bg-secondary', 'bg-tertiary-fixed-dim', 'bg-primary-container', 'bg-amber-400']
            return (
              <div key={i} className="relative">
                <div className={`absolute -left-[1.375rem] top-1 w-3 h-3 rounded-full ${colors[i % colors.length]} border-2 border-background`} />
                <div className="text-xs font-bold text-on-surface mb-1 capitalize">
                  {stage.agent.replace(/_/g, ' ')}
                </div>
                {decision && (
                  <div className={`text-[10px] font-mono font-bold mb-1 ${decision === 'EXECUTE' ? 'text-primary-container' : decision === 'WAIT' ? 'text-amber-400' : 'text-on-surface-variant'}`}>
                    {decision}{confidence ? ` (${(confidence * 100).toFixed(0)}%)` : ''}
                  </div>
                )}
                {reasoning && (
                  <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-3">{reasoning}</p>
                )}
              </div>
            )
          })}
          {stages.length === 0 && (
            <p className="text-xs text-on-surface-variant/50 italic">No stage data available.</p>
          )}
        </div>
      </div>
    </aside>
  )
}

function PriceCell({
  label,
  value,
  highlight,
  border,
}: {
  label: string
  value: number | null | undefined
  highlight?: boolean
  border?: string
}) {
  return (
    <div className={`bg-surface-container-low p-3 rounded-lg flex flex-col gap-1 ${border ?? 'border border-outline-variant/5'}`}>
      <span className="text-[10px] text-on-surface-variant font-medium uppercase tracking-wider">{label}</span>
      <span className={`text-sm font-mono font-bold ${highlight ? 'text-primary' : ''}`}>
        {value != null ? value.toFixed(5) : '—'}
      </span>
    </div>
  )
}
