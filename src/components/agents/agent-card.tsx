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
  const tierColor = agent.tier === 1 ? 'text-blue-400' : 'text-purple-400'

  return (
    <motion.div
      layout
      className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden cursor-pointer"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-green-500' : 'bg-zinc-600'}`} />
            <span className="font-medium text-sm">{agent.name.replace(/_/g, ' ')}</span>
          </div>
          <span className={`text-xs ${tierColor}`}>Tier {agent.tier}</span>
        </div>
        <div className="mt-2 text-xs text-zinc-500">
          {agent.insight_type} · every {agent.interval_seconds}s
        </div>
        {latestInsight && (
          <div className="mt-2 text-xs text-zinc-400">
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
            className="border-t border-zinc-800 p-4"
          >
            <pre className="text-xs text-zinc-300 overflow-auto max-h-64">
              {JSON.stringify(latestInsight.data, null, 2)}
            </pre>
            <div className="mt-2 text-xs text-zinc-500">
              {new Date(latestInsight.created_at).toLocaleString()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
