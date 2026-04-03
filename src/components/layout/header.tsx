'use client'

import { useAtom } from 'jotai'
import { motion } from 'framer-motion'

import { sidebarOpenAtom } from '@/stores/app'

export function Header() {
  const [isOpen, setIsOpen] = useAtom(sidebarOpenAtom)

  return (
    <header
      className="h-14 flex items-center justify-between px-5"
      style={{
        borderBottom: '1px solid var(--void-border-subtle)',
        background: 'rgba(5, 5, 8, 0.6)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-[var(--void-elevated)]"
          style={{ color: 'var(--text-secondary)' }}
        >
          <motion.span
            animate={{ rotate: isOpen ? 0 : 180 }}
            transition={{ duration: 0.2 }}
            className="text-sm"
          >
            {'\u2039\u2039'}
          </motion.span>
        </button>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>
          {new Date().toLocaleTimeString('en-US', { hour12: false })}
        </div>
      </div>
    </header>
  )
}
