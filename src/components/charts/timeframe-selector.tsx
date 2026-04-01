'use client'

import { useAtom } from 'jotai'
import { activeTimeframeAtom } from '@/stores/app'

const TIMEFRAMES = [
  { label: '1m', value: 'M1' },
  { label: '5m', value: 'M5' },
  { label: '15m', value: 'M15' },
  { label: '1H', value: 'H1' },
  { label: '4H', value: 'H4' },
  { label: '1D', value: 'D' },
]

export function TimeframeSelector() {
  const [activeTimeframe, setActiveTimeframe] = useAtom(activeTimeframeAtom)

  return (
    <div className="flex gap-1">
      {TIMEFRAMES.map((tf) => (
        <button
          key={tf.value}
          onClick={() => setActiveTimeframe(tf.value)}
          className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
            activeTimeframe === tf.value
              ? 'bg-zinc-700 text-white'
              : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
          }`}
        >
          {tf.label}
        </button>
      ))}
    </div>
  )
}
