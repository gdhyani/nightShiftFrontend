'use client'

import { useAccount } from '@/hooks/useAccount'
import { usePositions } from '@/hooks/useTrades'

export default function RiskPage() {
  const { data: account, isLoading: accountLoading } = useAccount()
  const { data: positions, isLoading: positionsLoading } = usePositions()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Risk &amp; Capital</h1>
        <p className="text-zinc-500 mt-1">Account overview, risk limits, and open positions</p>
      </div>

      <div>
        <h2 className="text-sm font-medium text-zinc-400 mb-3">Account</h2>
        {accountLoading || !account ? (
          <div className="text-zinc-500">Loading account...</div>
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
              <div key={s.label} className="bg-zinc-900 rounded-lg p-4">
                <div className="text-xs text-zinc-500">{s.label}</div>
                <div className="text-lg font-bold mt-1">{s.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-medium text-zinc-400 mb-3">Open Positions</h2>
        {positionsLoading ? (
          <div className="text-zinc-500">Loading positions...</div>
        ) : !positions?.length ? (
          <div className="text-zinc-500">No open positions</div>
        ) : (
          <div>
            <div className="grid grid-cols-7 gap-4 px-4 py-2 text-xs text-zinc-500 uppercase tracking-wider">
              <div>Symbol</div><div>Direction</div><div>Entry</div><div>Current</div><div>Qty</div><div>Unrealized P&amp;L</div><div>SL / TP</div>
            </div>
            {positions.map((p) => (
              <div key={p.id} className="grid grid-cols-7 gap-4 items-center px-4 py-3 hover:bg-zinc-900 rounded-lg transition-colors">
                <div className="text-sm font-medium">{p.symbol.replace('_', '/')}</div>
                <div className={`text-xs font-bold ${p.direction === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>{p.direction}</div>
                <div className="text-sm font-mono text-zinc-300">{p.entry_price.toFixed(5)}</div>
                <div className="text-sm font-mono text-zinc-300">{p.current_price?.toFixed(5) ?? '--'}</div>
                <div className="text-sm">{p.quantity}</div>
                <div className={`text-sm font-mono ${(p.unrealized_pnl ?? 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {p.unrealized_pnl != null ? `${p.unrealized_pnl >= 0 ? '+' : ''}${p.unrealized_pnl.toFixed(5)}` : '--'}
                </div>
                <div className="text-xs text-zinc-500">
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
