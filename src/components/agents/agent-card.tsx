'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import type { AgentDef, AgentInsight } from '@/types/api'

interface Props {
  agent: AgentDef
  latestInsight: AgentInsight | null
}

export function AgentCard({ agent, latestInsight }: Props) {
  const [expanded, setExpanded] = useState(false)
  const isActive = latestInsight != null
  const tierColor = agent.tier === 1 ? 'var(--accent-cyan)' : 'var(--accent-amber)'

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: 'var(--void-surface)',
        border: '1px solid',
        borderColor: isActive ? tierColor : 'var(--void-border)',
        boxShadow: isActive ? `0 0 15px ${agent.tier === 1 ? 'rgba(6, 182, 212, 0.1)' : 'rgba(245, 158, 11, 0.1)'}` : 'none',
      }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{
              background: isActive ? 'var(--accent-emerald)' : 'var(--text-muted)',
              boxShadow: isActive ? '0 0 8px var(--accent-emerald-glow)' : 'none',
            }} />
            <span className="font-medium text-sm" style={{ color: 'var(--text-primary)' }}>{agent.name.replace(/_/g, ' ')}</span>
          </div>
          <span className="text-xs" style={{ color: tierColor }}>Tier {agent.tier}</span>
        </div>
        <div className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
          {agent.insight_type} · every {agent.interval_seconds}s
        </div>
        {latestInsight && (
          <div className="mt-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
            Confidence: {latestInsight.confidence != null ? `${(latestInsight.confidence * 100).toFixed(0)}%` : '—'}
          </div>
        )}
      </div>

      <AnimatePresence>
        {expanded && latestInsight && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4"
            style={{ borderTop: '1px solid var(--void-border)' }}
          >
            <pre className="text-xs overflow-auto max-h-64" style={{ color: 'var(--text-primary)' }}>
              {JSON.stringify(latestInsight.data, null, 2)}
            </pre>
            <div className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
              {new Date(latestInsight.created_at).toLocaleString()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
