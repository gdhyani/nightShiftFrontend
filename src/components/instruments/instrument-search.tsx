'use client'

import { useState } from 'react'
import { useAtom } from 'jotai'
import { motion, AnimatePresence } from 'framer-motion'
import { useInstrumentSearch } from '@/hooks/useInstruments'
import { activeSymbolAtom } from '@/stores/app'

export function InstrumentSearch() {
  const [query, setQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [, setSymbol] = useAtom(activeSymbolAtom)
  const { data: results } = useInstrumentSearch(query)

  return (
    <div className="relative">
      <input
        type="text"
        value={query}
        onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }}
        onFocus={() => setIsOpen(true)}
        placeholder="Search instruments..."
        className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all focus:ring-1"
        style={{ background: 'var(--void-elevated)', border: '1px solid var(--void-border)', color: 'var(--text-primary)', '--tw-ring-color': 'var(--accent-cyan)' } as React.CSSProperties}
      />
      <AnimatePresence>
        {isOpen && results && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-50 w-full mt-1 rounded-xl overflow-hidden max-h-64 overflow-y-auto"
            style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
          >
            {results.map((inst) => (
              <button
                key={inst.instrument_key}
                onClick={() => { setSymbol(inst.instrument_key); setQuery(inst.symbol); setIsOpen(false) }}
                className="w-full text-left px-4 py-3 transition-colors hover:brightness-125 flex items-center justify-between"
                style={{ borderBottom: '1px solid var(--void-border)' }}
              >
                <div>
                  <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{inst.symbol}</div>
                  <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{inst.name}</div>
                </div>
                <span className="text-xs font-[family-name:var(--font-mono)]" style={{ color: 'var(--text-secondary)' }}>{inst.exchange}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
