'use client'

import { CandlestickChart } from '@/components/charts/candlestick-chart'
import { useTrade } from '@/hooks/useTrades'

interface Props { tradeId: number }

export function TradeDetailClient({ tradeId }: Props) {
  const { data: trade, isLoading } = useTrade(tradeId)
  if (isLoading || !trade) return <div style={{ color: 'var(--text-secondary)' }}>Loading trade...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Trade #{trade.id} — {trade.symbol.replace('_', '/')}</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-sm font-bold" style={{ color: trade.direction === 'BUY' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{trade.direction}</span>
            <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>@ {trade.entry_price?.toFixed(5)}</span>
            {trade.exit_price && <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>→ {trade.exit_price.toFixed(5)}</span>}
            {trade.pnl != null && (
              <span className="text-sm font-[family-name:var(--font-mono)]" style={{ color: trade.pnl >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                P&L: {trade.pnl >= 0 ? '+' : ''}{trade.pnl.toFixed(5)}
              </span>
            )}
          </div>
        </div>
        <span className="text-xs px-3 py-1 rounded-lg" style={{
          background: trade.status === 'open' ? 'rgba(6, 182, 212, 0.15)' : 'var(--void-elevated)',
          color: trade.status === 'open' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
        }}>{trade.status}</span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'Entry', value: trade.entry_price?.toFixed(5) ?? '—', color: 'var(--text-primary)' },
          { label: 'Stop Loss', value: trade.stop_loss?.toFixed(5) ?? '—', color: 'var(--accent-rose)' },
          { label: 'Take Profit', value: trade.take_profit?.toFixed(5) ?? '—', color: 'var(--accent-emerald)' },
          { label: 'Quantity', value: String(trade.quantity ?? '—'), color: 'var(--text-primary)' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-3" style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border-subtle)' }}>
            <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
            <div className="text-sm font-[family-name:var(--font-mono)] mt-1" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Chart</h2>
        <CandlestickChart symbol={trade.symbol} timeframe="H1" height={400} />
      </div>

      {trade.reasoning && (
        <div>
          <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Agent Reasoning</h2>
          <div className="rounded-2xl p-4" style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border-subtle)' }}>
            <pre className="text-xs overflow-auto max-h-64" style={{ color: 'var(--text-primary)' }}>{JSON.stringify(trade.reasoning, null, 2)}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
