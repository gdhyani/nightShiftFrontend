'use client'

import { usePortfolioHoldings } from '@/hooks/usePortfolio'

export function HoldingsTable() {
  const { data: holdings, isLoading } = usePortfolioHoldings()
  if (isLoading) return <div className="text-on-surface-variant text-sm">Loading holdings...</div>
  if (!holdings?.length) return <div className="text-on-surface-variant text-sm">No holdings</div>

  return (
    <div className="bg-surface-container-lowest rounded-xl overflow-hidden">
      <div className="grid grid-cols-4 gap-4 px-5 py-3 text-on-surface-variant text-[11px] uppercase tracking-wider font-mono border-b border-outline-variant/10">
        <div>Symbol</div><div>Qty</div><div>Avg Price</div><div>P&amp;L</div>
      </div>
      <div className="divide-y divide-outline-variant/5">
        {holdings.map((h, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 px-5 py-3">
            <div className="text-sm font-medium text-on-surface">{h.symbol.split('|').pop()?.slice(0, 10) || h.symbol}</div>
            <div className="text-sm font-mono tabular-nums text-on-surface">{h.quantity}</div>
            <div className="text-sm font-mono tabular-nums text-on-surface-variant">{h.average_price.toFixed(2)}</div>
            <div className={`text-sm font-mono tabular-nums ${h.pnl >= 0 ? 'text-primary-container' : 'text-error'}`}>
              {h.pnl >= 0 ? '+' : ''}{h.pnl.toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
