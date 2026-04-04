'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import type { AgentDef, AgentInsight } from '@/types/api'

interface Props {
  agent: AgentDef
  latestInsight: AgentInsight | null
}

const AGENT_ICONS: Record<string, string> = {
  news_agent: '📰',
  order_flow_agent: '📊',
  session_agent: '🕐',
  correlation_agent: '🔗',
  range_agent: '📐',
  bias_agent: '🧭',
  liquidity_agent: '💧',
  structure_agent: '🏗️',
}

export function AgentCard({ agent, latestInsight }: Props) {
  const [expanded, setExpanded] = useState(false)
  const isActive = latestInsight != null
  const isTier1 = agent.tier === 1

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      className={`
        bg-surface-container-lowest p-5 rounded-xl cursor-pointer
        border-l-4 transition-colors
        ${isTier1 ? 'border-primary tier-1-glow' : 'border-secondary tier-2-glow'}
        ${isActive ? (isTier1 ? 'ring-1 ring-primary/30' : 'ring-1 ring-secondary/30') : ''}
        hover:bg-surface-container-low
      `}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg text-lg ${isTier1 ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}>
          {AGENT_ICONS[agent.name] ?? '🤖'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-headline font-bold text-lg text-on-surface truncate">
              {agent.name.replace(/_/g, ' ').replace(/\bagent\b/i, '').trim()}
            </span>
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded shrink-0 ${isTier1 ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
              TIER {agent.tier}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-primary-container' : 'bg-on-surface-variant/40'}`} />
            <span className="text-[10px] font-mono text-on-surface-variant">
              {agent.insight_type} · {agent.interval_seconds}s
            </span>
          </div>
        </div>
      </div>

      {latestInsight && (
        <div className="mt-3 flex items-center justify-between">
          <span className="text-[10px] font-mono text-on-surface-variant">
            Confidence
          </span>
          <span className={`text-sm font-bold tabular-nums ${isTier1 ? 'text-primary' : 'text-secondary'}`}>
            {latestInsight.confidence != null ? `${(latestInsight.confidence * 100).toFixed(0)}%` : '—'}
          </span>
        </div>
      )}

      <AnimatePresence>
        {expanded && latestInsight && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-outline-variant/10"
          >
            <pre className="text-xs font-mono overflow-auto max-h-64 text-on-surface whitespace-pre-wrap break-words">
              {JSON.stringify(latestInsight.data, null, 2)}
            </pre>
            <div className="mt-2 text-[10px] font-mono text-on-surface-variant">
              {new Date(latestInsight.created_at).toLocaleString()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
