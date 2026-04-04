'use client'

import { useAtom } from 'jotai'
import { motion } from 'framer-motion'
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
        <motion.button
          key={tf.value}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setActiveTimeframe(tf.value)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTimeframe === tf.value
              ? 'bg-primary-container/20 text-primary border border-primary-container/40'
              : 'text-on-surface-variant hover:bg-surface-container-high border border-transparent'
          }`}
        >
          {tf.label}
        </motion.button>
      ))}
    </div>
  )
}
