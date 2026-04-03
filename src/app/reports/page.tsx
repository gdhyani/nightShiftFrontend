'use client'

import { useReports } from '@/hooks/useReports'

export default function ReportsPage() {
  const { data: reports, isLoading } = useReports()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Daily Review</h1>
        <p className="text-zinc-500 mt-1">Daily trading reports and performance summaries</p>
      </div>

      {isLoading ? (
        <div className="text-zinc-500">Loading reports...</div>
      ) : !reports?.length ? (
        <div className="text-zinc-500">No reports yet. Reports are generated at the end of each trading day.</div>
      ) : (
        <div className="space-y-4">
          {reports.map((r) => (
            <div key={r.id} className="bg-zinc-900 rounded-lg p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="text-sm font-medium">{new Date(r.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <div className={`text-sm font-mono font-bold ${r.total_pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {r.total_pnl >= 0 ? '+' : ''}{r.total_pnl.toFixed(5)}
                </div>
              </div>
              <div className="flex gap-4 mb-3">
                <div className="text-xs text-zinc-500">Trades: <span className="text-zinc-300">{r.trades_count}</span></div>
                <div className="text-xs text-zinc-500">Wins: <span className="text-green-400">{r.wins}</span></div>
                <div className="text-xs text-zinc-500">Losses: <span className="text-red-400">{r.losses}</span></div>
              </div>
              {r.summary && (
                <p className="text-sm text-zinc-400 leading-relaxed">{r.summary}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
