'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTrades } from '@/hooks/useTrades'

export function TradeTable() {
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined)
  const { data: trades, isLoading } = useTrades({ status: statusFilter })
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {['all', 'open', 'closed'].map((s) => (
          <button key={s}
            onClick={() => setStatusFilter(s === 'all' ? undefined : s)}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              (s === 'all' && !statusFilter) || statusFilter === s
                ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >{s.charAt(0).toUpperCase() + s.slice(1)}</button>
        ))}
      </div>

      {isLoading ? <div className="text-zinc-500">Loading trades...</div> :
       !trades?.length ? <div className="text-zinc-500">No trades found.</div> : (
        <div>
          <div className="grid grid-cols-7 gap-4 px-4 py-2 text-xs text-zinc-500 uppercase tracking-wider">
            <div>Symbol</div><div>Direction</div><div>Entry</div><div>Exit</div><div>P&L</div><div>Status</div><div>Time</div>
          </div>
          {trades.map((trade) => (
            <div key={trade.id}>
              <div onClick={() => setExpandedId(expandedId === trade.id ? null : trade.id)}
                className="grid grid-cols-7 gap-4 items-center px-4 py-3 hover:bg-zinc-900 rounded-lg cursor-pointer transition-colors">
                <div className="text-sm font-medium">{trade.symbol.replace('_', '/')}</div>
                <div className={`text-xs font-bold ${trade.direction === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>{trade.direction}</div>
                <div className="text-sm font-mono text-zinc-300">{trade.entry_price?.toFixed(5) ?? '—'}</div>
                <div className="text-sm font-mono text-zinc-300">{trade.exit_price?.toFixed(5) ?? '—'}</div>
                <div className={`text-sm font-mono ${(trade.pnl ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trade.pnl != null ? `${trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(5)}` : '—'}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded w-fit ${
                  trade.status === 'open' ? 'bg-blue-900 text-blue-300' :
                  trade.status === 'closed' ? 'bg-zinc-800 text-zinc-400' : 'bg-yellow-900 text-yellow-300'
                }`}>{trade.status}</span>
                <div className="text-xs text-zinc-500">{trade.opened_at ? new Date(trade.opened_at).toLocaleString() : '—'}</div>
              </div>
              <AnimatePresence>
                {expandedId === trade.id && trade.reasoning && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="mx-4 mb-2 border border-zinc-800 rounded-lg p-4 overflow-hidden">
                    <div className="text-xs text-zinc-500 mb-2">Agent Reasoning:</div>
                    <pre className="text-xs text-zinc-300 overflow-auto max-h-48">{JSON.stringify(trade.reasoning, null, 2)}</pre>
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
