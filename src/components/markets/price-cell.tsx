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

  if (price == null) return <span className="text-on-surface-variant">—</span>

  return (
    <motion.span
      key={price}
      initial={
        direction
          ? {
              backgroundColor:
                direction === 'up' ? 'rgba(0, 255, 65, 0.15)' : 'rgba(255, 180, 171, 0.15)',
            }
          : {}
      }
      animate={{ backgroundColor: 'rgba(0,0,0,0)' }}
      transition={{ duration: 1 }}
      className={`font-mono tabular-nums text-sm px-1 rounded ${
        direction === 'up'
          ? 'text-primary-container'
          : direction === 'down'
            ? 'text-error'
            : 'text-on-surface'
      }`}
    >
      {price.toFixed(5)}
    </motion.span>
  )
}
