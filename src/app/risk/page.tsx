'use client'

import { usePortfolioMargins } from '@/hooks/usePortfolio'
import { HoldingsTable } from '@/components/portfolio/holdings-table'
import { PositionsTable } from '@/components/portfolio/positions-table'

export default function RiskPage() {
  const { data: margins, isLoading } = usePortfolioMargins()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline font-bold text-3xl uppercase tracking-tight text-on-surface">Portfolio &amp; Risk</h1>
        <p className="mt-1 text-on-surface-variant text-sm">Account margins, holdings, and open positions</p>
      </div>

      <div>
        <h2 className="text-on-surface-variant text-[11px] uppercase tracking-wider font-mono mb-3">Margins</h2>
        {isLoading || !margins ? (
          <div className="text-on-surface-variant text-sm">Loading margins...</div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Balance', value: `₹${margins.balance.toFixed(2)}` },
              { label: 'Equity', value: `₹${margins.equity.toFixed(2)}` },
              { label: 'Margin Used', value: `₹${margins.margin_used.toFixed(2)}` },
              { label: 'Available', value: `₹${margins.available.toFixed(2)}` },
            ].map((s) => (
              <div key={s.label} className="bg-surface-container-lowest rounded-xl p-5">
                <div className="text-on-surface-variant text-[10px] uppercase tracking-[0.2em] font-mono">{s.label}</div>
                <div className="font-headline font-bold text-2xl tabular-nums text-secondary mt-1">{s.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-on-surface-variant text-[11px] uppercase tracking-wider font-mono mb-3">Holdings</h2>
        <HoldingsTable />
      </div>

      <div>
        <h2 className="text-on-surface-variant text-[11px] uppercase tracking-wider font-mono mb-3">Open Positions</h2>
        <PositionsTable />
      </div>
    </div>
  )
}
