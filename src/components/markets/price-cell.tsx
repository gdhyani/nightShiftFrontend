'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

interface Props {
  price: number | null
}

function usePriceDirection(price: number | null) {
  const [prev, setPrev] = useState(price)
  const [direction, setDirection] = useState<'up' | 'down' | null>(null)

  if (price !== prev) {
    if (price != null && prev != null) {
      if (price > prev) setDirection('up')
      else if (price < prev) setDirection('down')
      else setDirection(null)
    }
    setPrev(price)
  }

  return direction
}

export function PriceCell({ price }: Props) {
  const direction = usePriceDirection(price)

  if (price == null) return <span style={{ color: 'var(--text-muted)' }}>—</span>

  return (
    <motion.span
      key={price}
      initial={
        direction
          ? {
              backgroundColor:
                direction === 'up' ? 'var(--accent-emerald-glow)' : 'rgba(244, 63, 94, 0.15)',
            }
          : {}
      }
      animate={{ backgroundColor: 'rgba(0,0,0,0)' }}
      transition={{ duration: 1 }}
      className="font-[family-name:var(--font-mono)] text-sm px-1 rounded"
      style={{ color: 'var(--text-primary)' }}
    >
      {price.toFixed(5)}
    </motion.span>
  )
}
