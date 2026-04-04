'use client'

import { useState } from 'react'
import { useTradingConfig, useSwitchMode, useRequestDailyToken } from '@/hooks/useTradingConfig'

function StatusDot({ status }: { status: 'active' | 'expired' | 'missing' }) {
  const base = 'inline-block w-2.5 h-2.5 rounded-full'
  if (status === 'active') return <span className={`${base} bg-primary-container shadow-[0_0_8px_rgba(0,255,65,0.6)]`} />
  if (status === 'expired') return <span className={`${base} bg-error`} />
  return <span className={`${base} bg-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.4)]`} />
}

function StatusLabel({ status }: { status: 'active' | 'expired' | 'missing' }) {
  const cls =
    status === 'active'
      ? 'text-primary'
      : status === 'expired'
        ? 'text-error'
        : 'text-amber-400'
  return <span className={`text-xs font-medium capitalize ${cls}`}>{status}</span>
}

export default function SettingsPage() {
  const { data: config, isLoading } = useTradingConfig()
  const switchMode = useSwitchMode()
  const requestToken = useRequestDailyToken()
  const [confirmLive, setConfirmLive] = useState(false)

  const handleModeSwitch = (mode: 'paper' | 'live') => {
    if (mode === 'live' && !confirmLive) {
      setConfirmLive(true)
      return
    }
    switchMode.mutate(mode, {
      onSuccess: () => setConfirmLive(false),
    })
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-headline font-bold text-3xl text-on-surface">System Configuration</h1>
        <p className="mt-1 text-on-surface-variant font-light">
          Trading configuration, token status, and mode switching
        </p>
      </div>

      {/* Connections */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant mb-4">
          Connections
        </h2>
        {isLoading || !config ? (
          <div className="text-on-surface-variant text-sm animate-pulse">Loading config...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Daily Token */}
            <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-on-surface">Daily Token</div>
                <div className="text-xs text-on-surface-variant mt-0.5">Upstox daily access token</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot status={config.daily} />
                <StatusLabel status={config.daily} />
              </div>
            </div>

            {/* Sandbox Token */}
            <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10 flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-on-surface">Sandbox Token</div>
                <div className="text-xs text-on-surface-variant mt-0.5">Upstox sandbox access token</div>
              </div>
              <div className="flex items-center gap-2">
                <StatusDot status={config.sandbox} />
                <StatusLabel status={config.sandbox} />
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Trading Mode */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant mb-4">
          Trading Mode
        </h2>
        {config && (
          <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10 space-y-4">
            <div className="flex gap-3">
              {(['paper', 'live'] as const).map((mode) => {
                const isActive = config.mode === mode
                const isPaper = mode === 'paper'
                return (
                  <button
                    key={mode}
                    onClick={() => handleModeSwitch(mode)}
                    className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all capitalize border ${
                      isActive
                        ? isPaper
                          ? 'bg-secondary/20 text-secondary border-secondary/40'
                          : 'bg-error/10 text-error border-error/40'
                        : 'bg-surface-container-high text-on-surface-variant border-outline-variant/10 hover:border-outline-variant/30'
                    }`}
                  >
                    {mode} Trading
                  </button>
                )
              })}
            </div>

            {confirmLive && (
              <div className="glass-panel rounded-xl p-4 space-y-3 border border-error/40 bg-error/10">
                <div className="text-sm font-medium text-error">
                  Switch to live trading?
                </div>
                <div className="text-xs text-on-surface-variant">
                  This will execute real orders with real money. Make sure your tokens are active.
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { switchMode.mutate('live', { onSuccess: () => setConfirmLive(false) }) }}
                    className="px-4 py-2 rounded-lg text-sm font-bold bg-error text-white transition-all hover:brightness-110"
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
          </div>
        )}
      </section>

      {/* Token Management */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant mb-4">
          Token Management
        </h2>
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10 space-y-3">
          <div className="text-xs text-on-surface-variant">
            Request a new daily access token from Upstox. Required once per trading day.
          </div>
          <button
            onClick={() => requestToken.mutate()}
            disabled={requestToken.isPending}
            className="bg-primary-container text-on-primary font-bold px-5 py-2.5 rounded-lg text-sm transition-all hover:brightness-110 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {requestToken.isPending ? 'Requesting...' : 'Request Daily Token'}
          </button>
          {requestToken.isSuccess && (
            <div className="text-xs text-primary">Token request sent successfully.</div>
          )}
          {requestToken.isError && (
            <div className="text-xs text-error">Failed to request token. Check logs.</div>
          )}
        </div>
      </section>

      {/* About */}
      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wider text-on-surface-variant mb-4">
          About
        </h2>
        <div className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10 space-y-3">
          {[
            { label: 'Version', value: '0.1.0', mono: true },
            { label: 'Platform', value: 'NightShift AI Trading', mono: false },
            { label: 'Architecture', value: 'Multi-Agent (AgentScope)', mono: false },
          ].map((row) => (
            <div key={row.label} className="flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">{row.label}</span>
              <span className={`text-sm text-on-surface ${row.mono ? 'font-mono tabular-nums' : ''}`}>
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
