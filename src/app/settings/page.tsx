'use client'

import { useState } from 'react'
import { useTradingConfig, useSwitchMode, useRequestDailyToken } from '@/hooks/useTradingConfig'
import { useAccount } from '@/hooks/useAccount'

function StatusBadge({ status }: { status: 'active' | 'expired' | 'missing' }) {
  if (status === 'active')
    return (
      <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full border border-primary/20 font-bold tracking-wide">
        Connected
      </span>
    )
  return (
    <span className="bg-error/10 text-error text-[10px] px-2 py-0.5 rounded-full border border-error/20 font-bold tracking-wide">
      Disconnected
    </span>
  )
}

export default function SettingsPage() {
  const { data: config, isLoading } = useTradingConfig()
  const { data: account, isLoading: accountLoading } = useAccount()
  const switchMode = useSwitchMode()
  const requestToken = useRequestDailyToken()
  const [confirmLive, setConfirmLive] = useState(false)

  const isLive = config?.mode === 'live'

  const handleModeSwitch = () => {
    if (!isLive && !confirmLive) {
      setConfirmLive(true)
      return
    }
    if (isLive) {
      switchMode.mutate('paper')
    }
  }

  const fmt = (v: number | undefined) =>
    v != null ? `$${v.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '--'
  const pct = (v: number | undefined) =>
    v != null ? `${(v * 100).toFixed(1)}%` : '--'

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="mb-4">
        <h1 className="font-headline text-4xl font-bold tracking-tight text-on-surface mb-2">
          System Configuration
        </h1>
        <p className="text-on-surface-variant max-w-2xl">
          Refine your execution parameters, link external exchanges, and calibrate risk thresholds for the NightShift core.
        </p>
      </header>

      <div className="grid grid-cols-12 gap-6">
        {/* ── Left Column (8 cols) ── */}
        <section className="col-span-12 lg:col-span-8 space-y-6">

          {/* Real Account Mode Toggle */}
          <div className="bg-surface-container-low p-6 rounded-xl border border-outline-variant/10 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isLive ? 'bg-error-container/20' : 'bg-surface-container-highest'}`}>
                <span className={`material-symbols-outlined ${isLive ? 'text-error' : 'text-on-surface-variant'}`}>
                  {isLive ? 'warning' : 'shield'}
                </span>
              </div>
              <div>
                <h3 className="text-lg font-bold font-headline">Real Account Mode</h3>
                <p className="text-sm text-on-surface-variant">Execute orders directly on the live exchange terminal.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isLive && (
                <div className="bg-error-container text-on-error-container px-4 py-2 rounded-lg text-xs font-bold tracking-widest animate-pulse border border-error/30">
                  TRADING WITH REAL CAPITAL
                </div>
              )}
              {!isLive && config && (
                <span className="text-xs font-mono text-on-surface-variant tracking-wide">PAPER MODE</span>
              )}
              <button
                onClick={handleModeSwitch}
                disabled={isLoading || switchMode.isPending}
                className={`w-14 h-8 rounded-full relative p-1 transition-colors disabled:opacity-40 ${
                  isLive ? 'bg-primary-container' : 'bg-surface-container-highest border border-outline-variant/20'
                }`}
              >
                <div
                  className={`absolute top-1 w-6 h-6 rounded-full shadow-lg transition-all ${
                    isLive
                      ? 'right-1 bg-on-primary-container'
                      : 'left-1 bg-on-surface-variant/40'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Live mode confirmation dialog */}
          {confirmLive && (
            <div className="bg-error/5 border border-error/40 rounded-xl p-5 space-y-3">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-error">warning</span>
                <span className="text-sm font-bold text-error">Switch to live trading?</span>
              </div>
              <p className="text-xs text-on-surface-variant">
                This will execute real orders with real money. Make sure your tokens are active and risk limits configured.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    switchMode.mutate('live', { onSuccess: () => setConfirmLive(false) })
                  }}
                  className="px-5 py-2.5 rounded-lg text-sm font-bold bg-error text-white transition-all hover:brightness-110"
                >
                  Confirm Switch to Live
                </button>
                <button
                  onClick={() => setConfirmLive(false)}
                  className="px-4 py-2 rounded-lg text-sm text-on-surface-variant bg-surface-container-high hover:bg-surface-container-highest transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* API Authentication Card */}
          <div className="bg-surface-container-high rounded-xl overflow-hidden">
            <div className="px-8 py-6 border-b border-outline-variant/5 flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold font-headline flex items-center gap-2">
                  OANDA API Authentication
                  {config && <StatusBadge status={config.daily} />}
                </h3>
                <p className="text-sm text-on-surface-variant">Secure tunnel for algorithmic order routing.</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant/30 text-4xl">vpn_lock</span>
            </div>
            <div className="p-8 space-y-6">
              {isLoading ? (
                <div className="text-on-surface-variant text-sm animate-pulse">Loading config...</div>
              ) : config ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                        Daily Token
                      </label>
                      <div className="flex items-center gap-3 bg-surface-container-highest rounded-xl px-4 py-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          config.daily === 'active'
                            ? 'bg-primary-container shadow-[0_0_8px_rgba(0,255,65,0.6)]'
                            : config.daily === 'expired'
                              ? 'bg-error'
                              : 'bg-amber-400'
                        }`} />
                        <span className="font-mono text-sm text-on-surface capitalize">{config.daily}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant ml-1">
                        Sandbox Token
                      </label>
                      <div className="flex items-center gap-3 bg-surface-container-highest rounded-xl px-4 py-3">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          config.sandbox === 'active'
                            ? 'bg-primary-container shadow-[0_0_8px_rgba(0,255,65,0.6)]'
                            : config.sandbox === 'expired'
                              ? 'bg-error'
                              : 'bg-amber-400'
                        }`} />
                        <span className="font-mono text-sm text-on-surface capitalize">{config.sandbox}</span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={() => requestToken.mutate()}
                      disabled={requestToken.isPending}
                      className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-sm tracking-widest hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      <span className="material-symbols-outlined text-lg">sync</span>
                      {requestToken.isPending ? 'REQUESTING TOKEN...' : 'REQUEST DAILY TOKEN'}
                    </button>
                    {requestToken.isSuccess && (
                      <p className="text-xs text-primary mt-2 text-center">Token request sent successfully.</p>
                    )}
                    {requestToken.isError && (
                      <p className="text-xs text-error mt-2 text-center">Failed to request token. Check logs.</p>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          </div>

          {/* Webhook & API Cluster */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* WebSocket Listener */}
            <div className="bg-surface-container-lowest p-6 rounded-xl space-y-4 border border-outline-variant/10">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-secondary">webhook</span>
                <span className="text-[10px] font-mono text-on-surface-variant">WS_LIVE</span>
              </div>
              <h4 className="font-bold">WebSocket Listener</h4>
              <div className="bg-surface-container p-3 rounded-lg flex items-center justify-between">
                <code className="text-xs text-secondary-fixed-dim font-mono truncate">ws://localhost:8000/ws</code>
                <span className="material-symbols-outlined text-sm cursor-pointer text-on-surface-variant hover:text-primary shrink-0 ml-2">
                  content_copy
                </span>
              </div>
            </div>

            {/* API Access */}
            <div className="bg-surface-container-lowest p-6 rounded-xl space-y-4 border border-outline-variant/10">
              <div className="flex justify-between items-start">
                <span className="material-symbols-outlined text-tertiary-container">security</span>
                <span className="text-[10px] font-mono text-primary-container">ACTIVE</span>
              </div>
              <h4 className="font-bold">API Access</h4>
              <div className="bg-surface-container p-3 rounded-lg flex items-center justify-between">
                <code className="text-xs text-secondary-fixed-dim font-mono truncate">http://localhost:8000/api</code>
                <span className="material-symbols-outlined text-sm cursor-pointer text-on-surface-variant hover:text-primary shrink-0 ml-2">
                  content_copy
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ── Right Column (4 cols) ── */}
        <section className="col-span-12 lg:col-span-4 space-y-6">

          {/* Risk Protocol Card */}
          <div className="bg-surface-container-low rounded-xl p-8 border-l-4 border-primary">
            <h3 className="font-headline text-xl font-bold mb-6">Risk Protocol</h3>
            <div className="space-y-8">
              {accountLoading ? (
                <div className="text-on-surface-variant text-sm animate-pulse">Loading account...</div>
              ) : (
                <>
                  {/* Daily Loss Limit */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                        Daily Loss Limit
                      </label>
                      <span className="text-lg font-mono text-primary">
                        {fmt(account?.daily_loss_limit)}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-container shadow-[0_0_10px_rgba(0,255,65,0.4)] rounded-full"
                        style={{ width: '33%' }}
                      />
                    </div>
                  </div>

                  {/* Max Drawdown */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Max Drawdown</p>
                      <p className="text-[11px] text-on-surface-variant">Maximum portfolio drawdown threshold.</p>
                    </div>
                    <span className="font-mono text-sm text-primary">{pct(account?.max_drawdown)}</span>
                  </div>

                  {/* Risk Per Trade */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Risk Per Trade</p>
                      <p className="text-[11px] text-on-surface-variant">Position sizing risk limit.</p>
                    </div>
                    <span className="font-mono text-sm text-primary">{pct(account?.risk_per_trade)}</span>
                  </div>

                  {/* Max Position Size */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Max Position Size</p>
                      <p className="text-[11px] text-on-surface-variant">Largest single position allowed.</p>
                    </div>
                    <span className="font-mono text-sm text-primary">{fmt(account?.max_position_size)}</span>
                  </div>

                  <hr className="border-outline-variant/10" />

                  {/* AI Agent Overwatch */}
                  <div className="p-4 bg-surface-container-highest rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-2 h-2 rounded-full bg-secondary-container animate-pulse" />
                      <span className="text-xs font-bold tracking-tighter">AI AGENT OVERWATCH</span>
                    </div>
                    <p className="text-[11px] text-on-surface-variant italic">
                      &quot;Monitoring risk parameters across all active strategies. Risk profile: {account?.max_drawdown != null && account.max_drawdown <= 0.05 ? 'Conservative' : 'Moderate'}.&quot;
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Core Metrics */}
          <div className="glass-panel rounded-xl p-6 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant opacity-50">
              Core Metrics
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container p-4 rounded-xl">
                <p className="text-[10px] text-on-surface-variant mb-1">Balance</p>
                <p className="font-mono text-primary text-sm">{fmt(account?.balance)}</p>
              </div>
              <div className="bg-surface-container p-4 rounded-xl">
                <p className="text-[10px] text-on-surface-variant mb-1">Equity</p>
                <p className="font-mono text-primary text-sm">{fmt(account?.equity)}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container p-4 rounded-xl">
                <p className="text-[10px] text-on-surface-variant mb-1">Margin Used</p>
                <p className="font-mono text-primary text-sm">{fmt(account?.margin_used)}</p>
              </div>
              <div className="bg-surface-container p-4 rounded-xl">
                <p className="text-[10px] text-on-surface-variant mb-1">Version</p>
                <p className="font-mono text-primary text-sm">0.1.0</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
