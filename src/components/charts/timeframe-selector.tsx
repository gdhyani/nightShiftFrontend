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
          className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
          style={{
            background: activeTimeframe === tf.value ? 'var(--void-elevated)' : 'transparent',
            color: activeTimeframe === tf.value ? 'var(--accent-cyan)' : 'var(--text-secondary)',
            border: '1px solid',
            borderColor: activeTimeframe === tf.value ? 'var(--accent-cyan)' : 'var(--void-border)',
          }}
        >
          {tf.label}
        </motion.button>
      ))}
    </div>
  )
}
