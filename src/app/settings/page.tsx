'use client'

import { useAccount } from '@/hooks/useAccount'

function StatusDot({ connected }: { connected: boolean }) {
  return (
    <span className={`inline-block w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-zinc-600'}`} />
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
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-zinc-500 mt-1">Connections, account configuration, and system info</p>
      </div>

      <div>
        <h2 className="text-sm font-medium text-zinc-400 mb-3">Connections</h2>
        <div className="grid grid-cols-2 gap-3">
          {connections.map((c) => (
            <div key={c.name} className="bg-zinc-900 rounded-lg p-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium">{c.name}</div>
                <div className="text-xs text-zinc-500">{c.description}</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot connected={c.connected} />
                <span className={`text-xs ${c.connected ? 'text-green-400' : 'text-zinc-500'}`}>
                  {c.connected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-zinc-400 mb-3">Account Settings</h2>
        {isLoading || !account ? (
          <div className="text-zinc-500">Loading account...</div>
        ) : (
          <div className="bg-zinc-900 rounded-lg p-5 space-y-3">
            {[
              { label: 'Balance', value: `$${account.balance.toFixed(2)}` },
              { label: 'Risk per Trade', value: `${account.risk_per_trade}%` },
              { label: 'Daily Loss Limit', value: `$${account.daily_loss_limit.toFixed(2)}` },
              { label: 'Max Drawdown', value: `${account.max_drawdown}%` },
              { label: 'Max Position Size', value: account.max_position_size.toLocaleString() },
              { label: 'Last Updated', value: new Date(account.updated_at).toLocaleString() },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between py-1">
                <span className="text-sm text-zinc-500">{s.label}</span>
                <span className="text-sm font-medium">{s.value}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-medium text-zinc-400 mb-3">About</h2>
        <div className="bg-zinc-900 rounded-lg p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Version</span>
            <span className="text-sm font-mono">0.1.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Platform</span>
            <span className="text-sm">NightShift AI Trading</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-500">Architecture</span>
            <span className="text-sm">Multi-Agent (AgentScope)</span>
          </div>
        </div>
      </div>
    </div>
  )
}
