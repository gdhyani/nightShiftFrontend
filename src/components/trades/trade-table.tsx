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
          <motion.button key={s}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setStatusFilter(s === 'all' ? undefined : s)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            style={{
              background: (s === 'all' && !statusFilter) || statusFilter === s
                ? 'var(--void-elevated)' : 'transparent',
              color: (s === 'all' && !statusFilter) || statusFilter === s
                ? 'var(--text-primary)' : 'var(--text-secondary)',
              border: '1px solid',
              borderColor: (s === 'all' && !statusFilter) || statusFilter === s
                ? 'var(--accent-cyan)' : 'var(--void-border)',
            }}
          >{s.charAt(0).toUpperCase() + s.slice(1)}</motion.button>
        ))}
      </div>

      {isLoading ? <div style={{ color: 'var(--text-secondary)' }}>Loading trades...</div> :
       !trades?.length ? <div style={{ color: 'var(--text-secondary)' }}>No trades found.</div> : (
        <div>
          <div className="grid grid-cols-7 gap-4 px-4 py-2 text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
            <div>Symbol</div><div>Direction</div><div>Entry</div><div>Exit</div><div>P&L</div><div>Status</div><div>Time</div>
          </div>
          {trades.map((trade) => (
            <div key={trade.id}>
              <div onClick={() => setExpandedId(expandedId === trade.id ? null : trade.id)}
                className="grid grid-cols-7 gap-4 items-center px-4 py-3 rounded-2xl cursor-pointer transition-colors"
                style={{ ['--tw-bg-opacity' as string]: 1 }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--void-surface)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{trade.symbol.replace('_', '/')}</div>
                <div className="text-xs font-bold" style={{ color: trade.direction === 'BUY' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{trade.direction}</div>
                <div className="text-sm font-[family-name:var(--font-mono)]" style={{ color: 'var(--text-primary)' }}>{trade.entry_price?.toFixed(5) ?? '—'}</div>
                <div className="text-sm font-[family-name:var(--font-mono)]" style={{ color: 'var(--text-primary)' }}>{trade.exit_price?.toFixed(5) ?? '—'}</div>
                <div className="text-sm font-[family-name:var(--font-mono)]" style={{ color: (trade.pnl ?? 0) >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                  {trade.pnl != null ? `${trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(5)}` : '—'}
                </div>
                <span className="text-xs px-2 py-0.5 rounded-lg w-fit" style={{
                  background: trade.status === 'open' ? 'rgba(6, 182, 212, 0.15)' :
                    trade.status === 'closed' ? 'var(--void-elevated)' : 'rgba(245, 158, 11, 0.15)',
                  color: trade.status === 'open' ? 'var(--accent-cyan)' :
                    trade.status === 'closed' ? 'var(--text-secondary)' : 'var(--accent-amber)',
                }}>{trade.status}</span>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{trade.opened_at ? new Date(trade.opened_at).toLocaleString() : '—'}</div>
              </div>
              <AnimatePresence>
                {expandedId === trade.id && trade.reasoning && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="mx-4 mb-2 rounded-2xl p-4 overflow-hidden"
                    style={{ border: '1px solid var(--void-border)', background: 'var(--void-surface)' }}>
                    <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>Agent Reasoning:</div>
                    <pre className="text-xs overflow-auto max-h-48" style={{ color: 'var(--text-primary)' }}>{JSON.stringify(trade.reasoning, null, 2)}</pre>
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
