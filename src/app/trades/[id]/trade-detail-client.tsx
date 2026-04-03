'use client'

import { CandlestickChart } from '@/components/charts/candlestick-chart'
import { useTrade } from '@/hooks/useTrades'

interface Props { tradeId: number }

export function TradeDetailClient({ tradeId }: Props) {
  const { data: trade, isLoading } = useTrade(tradeId)
  if (isLoading || !trade) return <div className="text-zinc-500">Loading trade...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Trade #{trade.id} — {trade.symbol.replace('_', '/')}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-sm font-bold ${trade.direction === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>{trade.direction}</span>
            <span className="text-zinc-500 text-sm">@ {trade.entry_price?.toFixed(5)}</span>
            {trade.exit_price && <span className="text-zinc-500 text-sm">→ {trade.exit_price.toFixed(5)}</span>}
            {trade.pnl != null && (
              <span className={`text-sm font-mono ${trade.pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                P&L: {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(5)}
              </span>
            )}
          </div>
        </div>
        <span className={`text-xs px-3 py-1 rounded ${trade.status === 'open' ? 'bg-blue-900 text-blue-300' : 'bg-zinc-800 text-zinc-400'}`}>{trade.status}</span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Entry', value: trade.entry_price?.toFixed(5) ?? '—', color: 'text-white' },
          { label: 'Stop Loss', value: trade.stop_loss?.toFixed(5) ?? '—', color: 'text-red-400' },
          { label: 'Take Profit', value: trade.take_profit?.toFixed(5) ?? '—', color: 'text-green-400' },
          { label: 'Quantity', value: String(trade.quantity ?? '—'), color: 'text-white' },
        ].map((s) => (
          <div key={s.label} className="bg-zinc-900 rounded-lg p-3">
            <div className="text-xs text-zinc-500">{s.label}</div>
            <div className={`text-sm font-mono mt-1 ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-medium text-zinc-400 mb-3">Chart</h2>
        <CandlestickChart symbol={trade.symbol} timeframe="H1" height={400} />
      </div>

      {trade.reasoning && (
        <div>
          <h2 className="text-sm font-medium text-zinc-400 mb-3">Agent Reasoning</h2>
          <div className="bg-zinc-900 rounded-lg p-4">
            <pre className="text-xs text-zinc-300 overflow-auto max-h-64">{JSON.stringify(trade.reasoning, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
