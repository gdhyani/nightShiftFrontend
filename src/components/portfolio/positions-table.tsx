'use client'

import { usePortfolioPositions } from '@/hooks/usePortfolio'

export function PositionsTable() {
  const { data: positions, isLoading } = usePortfolioPositions()
  if (isLoading) return <div style={{ color: 'var(--text-muted)' }}>Loading positions...</div>
  if (!positions?.length) return <div style={{ color: 'var(--text-muted)' }}>No open positions</div>

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border)' }}>
      <div className="grid grid-cols-6 gap-4 px-5 py-3 text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--void-border)' }}>
        <div>Symbol</div><div>Side</div><div>Entry</div><div>Current</div><div>Qty</div><div>P&amp;L</div>
      </div>
      {positions.map((p, i) => (
        <div key={i} className="grid grid-cols-6 gap-4 px-5 py-3" style={{ borderBottom: '1px solid var(--void-border)' }}>
          <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{p.symbol.split('|').pop()?.slice(0, 10) || p.symbol}</div>
          <div className="text-xs font-bold" style={{ color: p.direction === 'BUY' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{p.direction}</div>
          <div className="text-sm font-[family-name:var(--font-mono)]" style={{ color: 'var(--text-secondary)' }}>{p.entry_price.toFixed(2)}</div>
          <div className="text-sm font-[family-name:var(--font-mono)]" style={{ color: 'var(--text-primary)' }}>{p.current_price.toFixed(2)}</div>
          <div className="text-sm font-[family-name:var(--font-mono)]" style={{ color: 'var(--text-primary)' }}>{p.quantity}</div>
          <div className="text-sm font-[family-name:var(--font-mono)]" style={{ color: p.unrealized_pnl >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
            {p.unrealized_pnl >= 0 ? '+' : ''}{p.unrealized_pnl.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  )
}
