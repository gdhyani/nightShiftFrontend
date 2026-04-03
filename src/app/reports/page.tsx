'use client'

import { motion } from 'framer-motion'
import { useReports } from '@/hooks/useReports'

export default function ReportsPage() {
  const { data: reports, isLoading } = useReports()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Daily Review</h1>
        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Daily trading reports and performance summaries</p>
      </div>

      {isLoading ? (
        <div style={{ color: 'var(--text-secondary)' }}>Loading reports...</div>
      ) : !reports?.length ? (
        <div style={{ color: 'var(--text-secondary)' }}>No reports yet. Reports are generated at the end of each trading day.</div>
      ) : (
        <div className="space-y-4">
          {reports.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-2xl p-5"
              style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border-subtle)' }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{new Date(r.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div className="text-sm font-[family-name:var(--font-mono)] font-bold" style={{ color: r.total_pnl >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                  {r.total_pnl >= 0 ? '+' : ''}{r.total_pnl.toFixed(5)}
                </div>
              </div>
              <div className="flex gap-4 mb-3">
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Trades: <span style={{ color: 'var(--text-primary)' }}>{r.trades_count}</span></div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Wins: <span style={{ color: 'var(--accent-emerald)' }}>{r.wins}</span></div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Losses: <span style={{ color: 'var(--accent-rose)' }}>{r.losses}</span></div>
              </div>
              {r.summary && (
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{r.summary}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
