'use client'

import { useAccount } from '@/hooks/useAccount'
import { usePositions } from '@/hooks/useTrades'

export default function RiskPage() {
  const { data: account, isLoading: accountLoading } = useAccount()
  const { data: positions, isLoading: positionsLoading } = usePositions()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Risk &amp; Capital</h1>
        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Account overview, risk limits, and open positions</p>
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Account</h2>
        {accountLoading || !account ? (
          <div style={{ color: 'var(--text-secondary)' }}>Loading account...</div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Balance', value: `$${account.balance.toFixed(2)}` },
              { label: 'Equity', value: `$${account.equity.toFixed(2)}` },
              { label: 'Margin Used', value: `$${account.margin_used.toFixed(2)}` },
              { label: 'Risk / Trade', value: `${account.risk_per_trade}%` },
              { label: 'Daily Loss Limit', value: `$${account.daily_loss_limit.toFixed(2)}` },
              { label: 'Max Drawdown', value: `${account.max_drawdown}%` },
              { label: 'Max Position Size', value: account.max_position_size.toLocaleString() },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl p-4" style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border-subtle)' }}>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{s.label}</div>
                <div className="text-lg font-bold font-[family-name:var(--font-mono)] mt-1" style={{ color: 'var(--accent-cyan)' }}>{s.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Open Positions</h2>
        {positionsLoading ? (
          <div style={{ color: 'var(--text-secondary)' }}>Loading positions...</div>
        ) : !positions?.length ? (
          <div style={{ color: 'var(--text-secondary)' }}>No open positions</div>
        ) : (
          <div>
            <div className="grid grid-cols-7 gap-4 px-4 py-2 text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              <div>Symbol</div><div>Direction</div><div>Entry</div><div>Current</div><div>Qty</div><div>Unrealized P&amp;L</div><div>SL / TP</div>
            </div>
            {positions.map((p) => (
              <div key={p.id} className="grid grid-cols-7 gap-4 items-center px-4 py-3 rounded-2xl transition-colors"
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--void-surface)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{p.symbol.replace('_', '/')}</div>
                <div className="text-xs font-bold" style={{ color: p.direction === 'BUY' ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>{p.direction}</div>
                <div className="text-sm font-[family-name:var(--font-mono)]" style={{ color: 'var(--text-primary)' }}>{p.entry_price.toFixed(5)}</div>
                <div className="text-sm font-[family-name:var(--font-mono)]" style={{ color: 'var(--text-primary)' }}>{p.current_price?.toFixed(5) ?? '--'}</div>
                <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{p.quantity}</div>
                <div className="text-sm font-[family-name:var(--font-mono)]" style={{ color: (p.unrealized_pnl ?? 0) >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                  {p.unrealized_pnl != null ? `${p.unrealized_pnl >= 0 ? '+' : ''}${p.unrealized_pnl.toFixed(5)}` : '--'}
                </div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {p.stop_loss?.toFixed(5) ?? '--'} / {p.take_profit?.toFixed(5) ?? '--'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
