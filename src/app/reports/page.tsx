'use client'

import { motion } from 'framer-motion'
import { useReports } from '@/hooks/useReports'

export default function ReportsPage() {
  const { data: reports, isLoading } = useReports()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline font-bold text-3xl uppercase tracking-tight text-on-surface">Daily Review</h1>
        <p className="text-on-surface-variant font-light mt-1">Daily trading reports and performance summaries</p>
      </div>

      {isLoading ? (
        <div className="text-on-surface-variant text-center py-12">Loading reports...</div>
      ) : !reports?.length ? (
        <div className="text-on-surface-variant text-center py-12">No reports yet. Reports are generated at the end of each trading day.</div>
      ) : (
        <div className="space-y-4">
          {reports.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="font-headline text-lg font-semibold text-on-surface">
                  {new Date(r.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className={`font-mono tabular-nums font-bold text-sm ${r.total_pnl >= 0 ? 'text-primary-container' : 'text-error'}`}>
                  {r.total_pnl >= 0 ? '+' : ''}{r.total_pnl.toFixed(5)}
                </div>
              </div>
              <div className="flex gap-4 mb-3 text-on-surface-variant text-sm">
                <div>Trades: <span className="text-on-surface">{r.trades_count}</span></div>
                <div>Wins: <span className="text-primary-container">{r.wins}</span></div>
                <div>Losses: <span className="text-error">{r.losses}</span></div>
              </div>
              {r.summary && (
                <p className="text-on-surface-variant text-sm leading-relaxed">{r.summary}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
