'use client'

import { CandlestickChart } from '@/components/charts/candlestick-chart'
import { useTrade } from '@/hooks/useTrades'

interface Props { tradeId: number }

export function TradeDetailClient({ tradeId }: Props) {
  const { data: trade, isLoading } = useTrade(tradeId)
  if (isLoading || !trade) return <div className="text-on-surface-variant">Loading trade...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-headline text-primary">Trade #{trade.id} — {trade.symbol.replace('_', '/')}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className={`text-sm font-bold ${trade.direction === 'BUY' ? 'text-primary-container' : 'text-error'}`}>{trade.direction}</span>
            <span className="text-sm text-on-surface-variant">@ {trade.entry_price?.toFixed(5)}</span>
            {trade.exit_price && <span className="text-sm text-on-surface-variant">→ {trade.exit_price.toFixed(5)}</span>}
            {trade.pnl != null && (
              <span className={`text-sm font-mono tabular-nums ${trade.pnl >= 0 ? 'text-primary-container' : 'text-error'}`}>
                P&L: {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(5)}
              </span>
            )}
          </div>
        </div>
        <span className={`text-xs px-3 py-1 rounded-lg ${
          trade.status === 'open'
            ? 'bg-secondary/20 text-secondary'
            : 'bg-surface-container-high text-on-surface-variant'
        }`}>{trade.status}</span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Entry', value: trade.entry_price?.toFixed(5) ?? '—', cls: 'text-on-surface' },
          { label: 'Stop Loss', value: trade.stop_loss?.toFixed(5) ?? '—', cls: 'text-error' },
          { label: 'Take Profit', value: trade.take_profit?.toFixed(5) ?? '—', cls: 'text-primary-container' },
          { label: 'Quantity', value: String(trade.quantity ?? '—'), cls: 'text-on-surface' },
        ].map((s) => (
          <div key={s.label} className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10">
            <div className="text-xs text-on-surface-variant">{s.label}</div>
            <div className={`text-sm font-mono tabular-nums mt-1 ${s.cls}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3 text-on-surface-variant">Chart</h2>
        <CandlestickChart symbol={trade.symbol} timeframe="H1" height={400} />
      </div>

      {trade.reasoning && (
        <div>
          <h2 className="text-sm font-medium mb-3 text-on-surface-variant">Agent Reasoning</h2>
          <div className="border-l-2 border-on-tertiary-container bg-surface-container-lowest rounded-xl p-4">
            <pre className="text-xs overflow-auto max-h-64 font-mono text-on-surface">{JSON.stringify(trade.reasoning, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
