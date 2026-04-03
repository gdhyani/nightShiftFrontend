'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { useEquityCurve } from '@/hooks/useAnalytics'

export function EquityCurve() {
  const { data: curve, isLoading } = useEquityCurve()
  if (isLoading) return <div className="text-zinc-500">Loading...</div>
  if (!curve?.length || curve.length < 2) return <div className="text-zinc-500">No trade data yet for equity curve</div>

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={curve}>
          <CartesianGrid stroke="#27272a" />
          <XAxis dataKey="time" tick={false} stroke="#52525b" />
          <YAxis stroke="#52525b" />
          <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46', borderRadius: '8px' }} />
          <Line type="monotone" dataKey="balance" stroke="#22c55e" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
