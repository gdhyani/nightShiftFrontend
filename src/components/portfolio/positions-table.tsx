'use client'

import { usePortfolioPositions } from '@/hooks/usePortfolio'

export function PositionsTable() {
  const { data: positions, isLoading } = usePortfolioPositions()
  if (isLoading) return <div className="text-on-surface-variant text-sm">Loading positions...</div>
  if (!positions?.length) return <div className="text-on-surface-variant text-sm">No open positions</div>

  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
      <div className="grid grid-cols-6 gap-4 px-5 py-3 text-on-surface-variant text-[11px] uppercase tracking-wider font-mono border-b border-outline-variant/10">
        <div>Symbol</div><div>Side</div><div>Entry</div><div>Current</div><div>Qty</div><div>P&amp;L</div>
      </div>
      <div className="divide-y divide-outline-variant/5">
        {positions.map((p, i) => (
          <div key={i} className="grid grid-cols-6 gap-4 px-5 py-3">
            <div className="text-sm text-on-surface">{p.symbol.split('|').pop()?.slice(0, 10) || p.symbol}</div>
            <div className={`text-xs font-bold ${p.direction === 'BUY' ? 'text-primary-container' : 'text-error'}`}>{p.direction}</div>
            <div className="text-sm font-mono tabular-nums text-on-surface-variant">{p.entry_price.toFixed(2)}</div>
            <div className="text-sm font-mono tabular-nums text-on-surface">{p.current_price.toFixed(2)}</div>
            <div className="text-sm font-mono tabular-nums text-on-surface">{p.quantity}</div>
            <div className={`text-sm font-mono tabular-nums ${p.unrealized_pnl >= 0 ? 'text-primary-container' : 'text-error'}`}>
              {p.unrealized_pnl >= 0 ? '+' : ''}{p.unrealized_pnl.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
