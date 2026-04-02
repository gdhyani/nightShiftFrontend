'use client'

import Link from 'next/link'
import { useStrategies, useToggleStrategy } from '@/hooks/useStrategies'

export function StrategyTable() {
  const { data: strategies, isLoading } = useStrategies()
  const toggleMutation = useToggleStrategy()

  if (isLoading) return <div className="text-zinc-500">Loading strategies...</div>
  if (!strategies?.length) return <div className="text-zinc-500">No strategies yet.</div>

  return (
    <div>
      <div className="grid grid-cols-6 gap-4 px-4 py-2 text-xs text-zinc-500 uppercase tracking-wider">
        <div>Name</div>
        <div>Symbols</div>
        <div>Interval</div>
        <div>Status</div>
        <div>Enabled</div>
        <div></div>
      </div>
      {strategies.map((s) => (
        <div key={s.id} className="grid grid-cols-6 gap-4 items-center px-4 py-3 hover:bg-zinc-900 rounded-lg transition-colors">
          <Link href={`/strategies/${s.id}`} className="font-medium text-sm hover:text-blue-400">{s.name}</Link>
          <div className="text-sm text-zinc-400">{s.symbols.replace(/,/g, ', ')}</div>
          <div className="text-sm text-zinc-400">{s.schedule_interval}s</div>
          <div>
            <span className={`text-xs px-2 py-0.5 rounded ${s.enabled ? 'bg-green-900 text-green-300' : 'bg-zinc-800 text-zinc-500'}`}>
              {s.enabled ? 'Active' : 'Inactive'}
            </span>
          </div>
          <div>
            <button
              onClick={() => toggleMutation.mutate({ id: s.id, enabled: !s.enabled })}
              className={`w-10 h-5 rounded-full transition-colors ${s.enabled ? 'bg-green-600' : 'bg-zinc-700'}`}
            >
              <div className={`w-4 h-4 rounded-full bg-white transition-transform ${s.enabled ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <Link href={`/strategies/${s.id}`} className="text-xs text-zinc-500 hover:text-white">View →</Link>
        </div>
      ))}
    </div>
  )
}
