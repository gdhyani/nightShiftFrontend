'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTrades } from '@/hooks/useTrades'

export function TradeTable() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const { data: trades, isLoading } = useTrades({ status: statusFilter })
  const [expandedId, setExpandedId] = useState<number | null>(null)

  const isActive = (s: string) =>
    (s === 'all' && !statusFilter) || statusFilter === s

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['all', 'open', 'closed'].map((s) => (
          <motion.button key={s}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStatusFilter(s === 'all' ? undefined : s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border ${
              isActive(s)
                ? 'bg-primary/20 text-primary border-primary-container/40'
                : 'text-on-surface-variant border-outline-variant/20 hover:bg-surface-container-high'
            }`}
          >{s.charAt(0).toUpperCase() + s.slice(1)}</motion.button>
        ))}
      </div>

      {isLoading ? <div className="text-on-surface-variant">Loading trades...</div> :
       !trades?.length ? <div className="text-on-surface-variant">No trades found.</div> : (
        <div className="divide-y divide-outline-variant/5">
          <div className="grid grid-cols-7 gap-4 px-4 py-2 text-[11px] uppercase tracking-wider text-on-surface-variant">
            <div>Symbol</div><div>Direction</div><div>Entry</div><div>Exit</div><div>P&L</div><div>Status</div><div>Time</div>
          </div>
          {trades.map((trade) => (
            <div key={trade.id}>
              <div onClick={() => setExpandedId(expandedId === trade.id ? null : trade.id)}
                className="grid grid-cols-7 gap-4 items-center px-4 py-3 cursor-pointer transition-colors hover:bg-surface-container-low"
              >
                <div className="text-sm font-medium text-on-surface">{trade.symbol.replace('_', '/')}</div>
                <div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono uppercase ${
                    trade.direction === 'BUY'
                      ? 'bg-primary/20 text-primary'
                      : 'bg-error/10 text-error'
                  }`}>{trade.direction}</span>
                </div>
                <div className="text-sm font-mono tabular-nums text-on-surface">{trade.entry_price?.toFixed(5) ?? '—'}</div>
                <div className="text-sm font-mono tabular-nums text-on-surface">{trade.exit_price?.toFixed(5) ?? '—'}</div>
                <div className={`text-sm font-mono tabular-nums ${(trade.pnl ?? 0) >= 0 ? 'text-primary-container' : 'text-error'}`}>
                  {trade.pnl != null ? `${trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(5)}` : '—'}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-lg w-fit ${
                  trade.status === 'open'
                    ? 'bg-secondary/20 text-secondary'
                    : trade.status === 'closed'
                      ? 'bg-surface-container-high text-on-surface-variant'
                      : 'bg-secondary/20 text-secondary'
                }`}>{trade.status}</span>
                <div className="text-xs text-on-surface-variant">{trade.opened_at ? new Date(trade.opened_at).toLocaleString() : '—'}</div>
              </div>
              <AnimatePresence>
                {expandedId === trade.id && trade.reasoning && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="mx-4 mb-2 border-l-2 border-on-tertiary-container bg-surface-container-lowest p-4 font-mono text-xs">
                      <div className="text-on-surface-variant mb-2">Agent Reasoning:</div>
                      <pre className="text-xs overflow-auto max-h-48 text-on-surface">{JSON.stringify(trade.reasoning, null, 2)}</pre>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
