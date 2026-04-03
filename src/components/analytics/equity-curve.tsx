'use client'

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { useEquityCurve } from '@/hooks/useAnalytics'

export function EquityCurve() {
  const { data: curve, isLoading } = useEquityCurve()

  if (isLoading) {
    return <div className="h-[300px] rounded-2xl animate-pulse" style={{ background: 'var(--void-surface)' }} />
  }
  if (!curve?.length || curve.length < 2) {
    return (
      <div className="h-[300px] rounded-2xl flex items-center justify-center" style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border)' }}>
        <span style={{ color: 'var(--text-muted)' }}>No trade data yet for equity curve</span>
      </div>
    )
  }

  return (
    <div className="h-[300px] rounded-2xl p-4" style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border)' }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={curve}>
          <defs>
            <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--void-border-subtle)" strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={false} stroke="var(--void-border)" />
          <YAxis stroke="var(--void-border)" tick={{ fill: 'var(--text-muted)', fontSize: 11, fontFamily: 'var(--font-mono)' }} />
          <Tooltip
            contentStyle={{
              background: 'var(--void-elevated)',
              border: '1px solid var(--void-border)',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
            }}
            labelStyle={{ color: 'var(--text-muted)' }}
            itemStyle={{ color: 'var(--accent-emerald)' }}
          />
          <Area type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2} fill="url(#equityGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
