'use client'

import { useState } from 'react'
import { useTradingConfig, useSwitchMode, useRequestDailyToken } from '@/hooks/useTradingConfig'

function TokenDot({ status }: { status: 'active' | 'expired' | 'missing' }) {
  const colors: Record<string, string> = {
    active: 'var(--accent-emerald)',
    expired: 'var(--accent-rose)',
    missing: 'var(--accent-amber)',
  }
  const glows: Record<string, string> = {
    active: '0 0 8px rgba(16,185,129,0.4)',
    expired: '0 0 8px rgba(244,63,94,0.4)',
    missing: '0 0 8px rgba(245,158,11,0.4)',
  }
  return (
    <span
      className="inline-block w-2 h-2 rounded-full"
      style={{ background: colors[status], boxShadow: glows[status] }}
    />
  )
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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Settings</h1>
        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Trading configuration, token status, and mode switching</p>
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Token Status</h2>
        {isLoading || !config ? (
          <div style={{ color: 'var(--text-muted)' }}>Loading config...</div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border)' }}>
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Daily Token</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Upstox daily access token</div>
              </div>
              <div className="flex items-center gap-2">
                <TokenDot status={config.daily} />
                <span className="text-xs capitalize" style={{ color: config.daily === 'active' ? 'var(--accent-emerald)' : config.daily === 'expired' ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>
                  {config.daily}
                </span>
              </div>
            </div>
            <div className="rounded-2xl p-4 flex items-center justify-between" style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border)' }}>
              <div>
                <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>Sandbox Token</div>
                <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Upstox sandbox access token</div>
              </div>
              <div className="flex items-center gap-2">
                <TokenDot status={config.sandbox} />
                <span className="text-xs capitalize" style={{ color: config.sandbox === 'active' ? 'var(--accent-emerald)' : config.sandbox === 'expired' ? 'var(--accent-rose)' : 'var(--accent-amber)' }}>
                  {config.sandbox}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Trading Mode</h2>
        {config && (
          <div className="rounded-2xl p-5 space-y-4" style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border)' }}>
            <div className="flex gap-3">
              {(['paper', 'live'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => handleModeSwitch(mode)}
                  className="flex-1 py-3 rounded-xl text-sm font-medium transition-all capitalize"
                  style={{
                    background: config.mode === mode ? (mode === 'paper' ? 'rgba(6,182,212,0.15)' : 'rgba(244,63,94,0.15)') : 'var(--void-elevated)',
                    color: config.mode === mode ? (mode === 'paper' ? 'var(--accent-cyan)' : 'var(--accent-rose)') : 'var(--text-secondary)',
                    border: `1px solid ${config.mode === mode ? (mode === 'paper' ? 'var(--accent-cyan)' : 'var(--accent-rose)') : 'var(--void-border)'}`,
                  }}
                >
                  {mode} {mode === 'paper' ? 'Trading' : 'Trading'}
                </button>
              ))}
            </div>

            {confirmLive && (
              <div className="rounded-xl p-4 space-y-3" style={{ background: 'rgba(244,63,94,0.1)', border: '1px solid var(--accent-rose)' }}>
                <div className="text-sm font-medium" style={{ color: 'var(--accent-rose)' }}>
                  Switch to live trading?
                </div>
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  This will execute real orders with real money. Make sure your tokens are active.
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => { switchMode.mutate('live', { onSuccess: () => setConfirmLive(false) }) }}
                    className="px-4 py-2 rounded-xl text-sm font-medium"
                    style={{ background: 'var(--accent-rose)', color: 'white' }}
                  >
                    Confirm Switch to Live
                  </button>
                  <button
                    onClick={() => setConfirmLive(false)}
                    className="px-4 py-2 rounded-xl text-sm"
                    style={{ color: 'var(--text-secondary)', background: 'var(--void-elevated)' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>Token Management</h2>
        <div className="rounded-2xl p-5 space-y-3" style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border)' }}>
          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>
            Request a new daily access token from Upstox. Required once per trading day.
          </div>
          <button
            onClick={() => requestToken.mutate()}
            disabled={requestToken.isPending}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
            style={{ background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-cyan))', boxShadow: '0 0 20px rgba(16,185,129,0.15)' }}
          >
            {requestToken.isPending ? 'Requesting...' : 'Request Daily Token'}
          </button>
          {requestToken.isSuccess && (
            <div className="text-xs" style={{ color: 'var(--accent-emerald)' }}>Token request sent successfully.</div>
          )}
          {requestToken.isError && (
            <div className="text-xs" style={{ color: 'var(--accent-rose)' }}>Failed to request token. Check logs.</div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium mb-3" style={{ color: 'var(--text-secondary)' }}>About</h2>
        <div className="rounded-2xl p-5 space-y-2" style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border)' }}>
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
