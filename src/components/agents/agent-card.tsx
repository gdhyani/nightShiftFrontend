'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import type { AgentDef, AgentInsight } from '@/types/api'

interface Props {
  agent: AgentDef
  latestInsight: AgentInsight | null
}

const AGENT_ICONS: Record<string, string> = {
  news_agent: 'newspaper',
  order_flow_agent: 'water_drop',
  session_agent: 'schedule',
  correlation_agent: 'hub',
  range_agent: 'straighten',
  bias_agent: 'trending_up',
  liquidity_agent: 'waves',
  structure_agent: 'account_tree',
}

const AGENT_DESCRIPTIONS: Record<string, string> = {
  news_agent: 'NLP-driven macro event processing and volatility scoring.',
  order_flow_agent: 'Tape reading and iceberg order detection.',
  session_agent: 'Temporal bias and liquidity cycle alignment.',
  correlation_agent: 'Inter-market asset mapping and divergence detection.',
  range_agent: 'Mean reversion mapping and volatility bands.',
  bias_agent: 'HTF trend alignment and directional filter.',
  liquidity_agent: 'SL hunt detection and pool identification.',
  structure_agent: 'Market structure shifts and BOS validation.',
}

export function AgentCard({ agent, latestInsight }: Props) {
  const [expanded, setExpanded] = useState(false)
  const isActive = latestInsight != null
  const isTier1 = agent.tier === 1

  const statusText = isActive
    ? latestInsight.confidence != null
      ? `ACTIVE: ${latestInsight.confidence > 0.6 ? 'BULLISH' : latestInsight.confidence < 0.4 ? 'BEARISH' : 'NEUTRAL'}`
      : 'ACTIVE: STANDBY'
    : 'ACTIVE: STANDBY'

  const statusColor = isActive
    ? latestInsight.confidence != null && latestInsight.confidence > 0.6
      ? isTier1
        ? 'text-primary'
        : 'text-secondary'
      : 'text-on-surface-variant'
    : 'text-on-surface-variant'

  const confidenceWidth = latestInsight?.confidence != null ? latestInsight.confidence * 100 : 0

  const displayName = agent.name
    .replace(/_/g, ' ')
    .replace(/\bagent\b/i, '')
    .trim()
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

  return (
    <motion.div
      layout
      className={`
        bg-surface-container-lowest p-5 rounded-xl cursor-pointer
        border-l-4 transition-all relative group
        ${isTier1 ? 'border-primary tier-1-glow' : 'border-secondary tier-2-glow'}
        ${isActive ? (isTier1 ? 'ring-1 ring-primary/30' : 'ring-1 ring-secondary/30') : ''}
        hover:bg-surface-container-low
      `}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Top row: icon left, tier badge + kebab right */}
      <div className="flex justify-between items-start mb-4">
        <div
          className={`p-2 rounded-lg ${isTier1 ? 'bg-primary/10 text-primary' : 'bg-secondary/10 text-secondary'}`}
        >
          <span className="material-symbols-outlined">
            {AGENT_ICONS[agent.name] ?? 'smart_toy'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-mono px-2 py-0.5 rounded ${isTier1 ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}
          >
            TIER {agent.tier}
          </span>
          <button
            className="text-on-surface-variant hover:text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="material-symbols-outlined text-lg">more_vert</span>
          </button>
        </div>
      </div>

      {/* Name */}
      <h3
        className={`font-headline font-bold text-lg mb-1 ${isTier1 ? '' : 'text-secondary'}`}
      >
        {displayName}
      </h3>

      {/* Description */}
      <p className="text-xs text-on-surface-variant mb-4 h-8">
        {AGENT_DESCRIPTIONS[agent.name] ?? agent.insight_type}
      </p>

      {/* Status bar */}
      <div className="flex items-center justify-between mt-auto">
        <span className={`text-[10px] font-mono ${statusColor}`}>{statusText}</span>
        {confidenceWidth > 0 && (
          <div className="flex gap-1 h-1.5 w-12 bg-surface-container rounded-full overflow-hidden">
            <div
              className={`h-full ${isTier1 ? 'bg-primary' : 'bg-secondary'}`}
              style={{ width: `${confidenceWidth}%` }}
            />
          </div>
        )}
      </div>

      {/* Expanded insight data */}
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
