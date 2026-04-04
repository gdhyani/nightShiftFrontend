'use client'

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { useEquityCurve } from '@/hooks/useAnalytics'

export function EquityCurve() {
  const { data: curve, isLoading } = useEquityCurve()

  if (isLoading) {
    return <div className="h-[300px] rounded-xl animate-pulse bg-surface-container-lowest" />
  }
  if (!curve?.length || curve.length < 2) {
    return (
      <div className="h-[300px] rounded-xl flex items-center justify-center bg-surface-container-lowest border border-outline-variant/10">
        <span className="text-on-surface-variant">No trade data yet for equity curve</span>
      </div>
    )
  }

  return (
    <div className="h-[300px] rounded-xl p-4 bg-surface-container-lowest border border-outline-variant/10">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={curve}>
          <defs>
            <linearGradient id="equityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00ff41" stopOpacity={0.15} />
              <stop offset="100%" stopColor="#00ff41" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1c1b1c" strokeDasharray="3 3" />
          <XAxis dataKey="time" tick={false} stroke="#1c1b1c" />
          <YAxis stroke="#1c1b1c" tick={{ fill: '#b9ccb2', fontSize: 11 }} />
          <Tooltip
            contentStyle={{
              background: '#353436',
              border: '1px solid rgba(185, 204, 178, 0.2)',
              borderRadius: '8px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              fontSize: '12px',
            }}
            labelStyle={{ color: '#b9ccb2' }}
            itemStyle={{ color: '#00ff41' }}
          />
          <Area type="monotone" dataKey="balance" stroke="#00ff41" strokeWidth={2} fill="url(#equityGradient)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
