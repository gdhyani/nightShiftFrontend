'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface Props {
  price: number | null
}

export function PriceCell({ price }: Props) {
  const prevPrice = useRef(price)
  const direction = price && prevPrice.current
    ? (price > prevPrice.current ? 'up' : price < prevPrice.current ? 'down' : null)
    : null

  useEffect(() => {
    prevPrice.current = price
  }, [price])

  if (price == null) return <span className="text-zinc-600">—</span>

  return (
    <motion.span
      key={price}
      initial={direction ? { backgroundColor: direction === 'up' ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)' } : {}}
      animate={{ backgroundColor: 'rgba(0,0,0,0)' }}
      transition={{ duration: 1 }}
      className="font-mono text-sm px-1 rounded"
    >
      {price.toFixed(5)}
    </motion.span>
  )
}
