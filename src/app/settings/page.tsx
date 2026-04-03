'use client'

import { useAccount } from '@/hooks/useAccount'

function StatusDot({ connected }: { connected: boolean }) {
  return (
    <span
      className="inline-block w-2 h-2 rounded-full"
      style={{
        background: connected ? 'var(--accent-emerald)' : 'var(--text-muted)',
        boxShadow: connected ? '0 0 8px var(--accent-emerald-glow)' : 'none',
      }}
    />
  )
}

export default function SettingsPage() {
  const { data: account, isLoading } = useAccount()

  const connections = [
    { name: 'OANDA', description: 'Market data feed', connected: true },
    { name: 'LLM Provider', description: 'AI agent inference', connected: true },
    { name: 'Finnhub', description: 'News and sentiment', connected: false },
    { name: 'MetaTrader 5', description: 'Paper trade execution', connected: false },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Connections, account configuration, and system info</p>
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Connections</h2>
        <div className="grid grid-cols-2 gap-3">
          {connections.map((c) => (
            <div key={c.name} className="rounded-2xl p-4 flex items-center justify-between" style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border-subtle)' }}>
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{c.name}</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{c.description}</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot connected={c.connected} />
                <span className="text-xs" style={{ color: c.connected ? 'var(--accent-emerald)' : 'var(--text-secondary)' }}>
                  {c.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Account Settings</h2>
        {isLoading || !account ? (
          <div style={{ color: 'var(--text-secondary)' }}>Loading account...</div>
        ) : (
          <div className="rounded-2xl p-5 space-y-3" style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border-subtle)' }}>
            {[
              { label: 'Balance', value: `$${account.balance.toFixed(2)}` },
              { label: 'Risk per Trade', value: `${account.risk_per_trade}%` },
              { label: 'Daily Loss Limit', value: `$${account.daily_loss_limit.toFixed(2)}` },
              { label: 'Max Drawdown', value: `${account.max_drawdown}%` },
              { label: 'Max Position Size', value: account.max_position_size.toLocaleString() },
              { label: 'Last Updated', value: new Date(account.updated_at).toLocaleString() },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between py-1">
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{s.label}</span>
                <span className="text-sm font-medium font-[family-name:var(--font-mono)]" style={{ color: 'var(--text-primary)' }}>{s.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>About</h2>
        <div className="rounded-2xl p-5 space-y-2" style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border-subtle)' }}>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Version</span>
            <span className="text-sm font-[family-name:var(--font-mono)]" style={{ color: 'var(--text-primary)' }}>0.1.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Platform</span>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>NightShift AI Trading</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Architecture</span>
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Multi-Agent (AgentScope)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
