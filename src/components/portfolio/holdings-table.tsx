'use client'

import { usePortfolioHoldings } from '@/hooks/usePortfolio'

export function HoldingsTable() {
  const { data: holdings, isLoading } = usePortfolioHoldings()
  if (isLoading) return <div style={{ color: 'var(--text-muted)' }}>Loading holdings...</div>
  if (!holdings?.length) return <div style={{ color: 'var(--text-muted)' }}>No holdings</div>

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border)' }}>
      <div className="grid grid-cols-4 gap-4 px-5 py-3 text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--void-border)' }}>
        <div>Symbol</div><div>Qty</div><div>Avg Price</div><div>P&amp;L</div>
      </div>
      {holdings.map((h, i) => (
        <div key={i} className="grid grid-cols-4 gap-4 px-5 py-3" style={{ borderBottom: '1px solid var(--void-border)' }}>
          <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{h.symbol.split('|').pop()?.slice(0, 10) || h.symbol}</div>
          <div className="text-sm font-[family-name:var(--font-mono)]" style={{ color: 'var(--text-primary)' }}>{h.quantity}</div>
          <div className="text-sm font-[family-name:var(--font-mono)]" style={{ color: 'var(--text-secondary)' }}>{h.average_price.toFixed(2)}</div>
          <div className="text-sm font-[family-name:var(--font-mono)]" style={{ color: h.pnl >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
            {h.pnl >= 0 ? '+' : ''}{h.pnl.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
}
