'use client'

import { usePortfolioMargins } from '@/hooks/usePortfolio'
import { HoldingsTable } from '@/components/portfolio/holdings-table'
import { PositionsTable } from '@/components/portfolio/positions-table'

export default function RiskPage() {
  const { data: margins, isLoading } = usePortfolioMargins()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Portfolio &amp; Risk</h1>
        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Account margins, holdings, and open positions</p>
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Margins</h2>
        {isLoading || !margins ? (
          <div style={{ color: 'var(--text-muted)' }}>Loading margins...</div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Balance', value: `₹${margins.balance.toFixed(2)}` },
              { label: 'Equity', value: `₹${margins.equity.toFixed(2)}` },
              { label: 'Margin Used', value: `₹${margins.margin_used.toFixed(2)}` },
              { label: 'Available', value: `₹${margins.available.toFixed(2)}` },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-4" style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border)' }}>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                <div className="text-lg font-bold font-[family-name:var(--font-mono)] mt-1" style={{ color: 'var(--accent-cyan)' }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Holdings</h2>
        <HoldingsTable />
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Open Positions</h2>
        <PositionsTable />
      </div>
    </div>
  )
}
