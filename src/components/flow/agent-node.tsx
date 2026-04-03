'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'
import { motion } from 'framer-motion'

interface AgentNodeData {
  label: string
  type: string
  status?: 'idle' | 'running' | 'done'
  output?: Record<string, unknown>
  [key: string]: unknown
}

export function AgentNode({ data }: NodeProps) {
  const nodeData = data as unknown as AgentNodeData
  const isDone = nodeData.status === 'done'
  const isRunning = nodeData.status === 'running'

  const borderColor = isRunning ? 'var(--accent-amber)' : isDone ? 'var(--accent-emerald)' : 'var(--void-border)'
  const glowColor = isRunning ? 'var(--accent-amber-glow)' : isDone ? 'var(--accent-emerald-glow)' : 'transparent'

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative min-w-[200px] rounded-2xl p-4"
      style={{
        background: 'var(--void-surface)',
        border: `1.5px solid ${borderColor}`,
        boxShadow: `0 0 24px ${glowColor}, 0 4px 24px rgba(0,0,0,0.4)`,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: 'var(--void-border)', width: 8, height: 8, border: 'none' }} />

      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full" style={{
          background: isDone ? 'var(--accent-emerald)' : isRunning ? 'var(--accent-amber)' : 'var(--text-muted)',
          boxShadow: isDone ? '0 0 8px var(--accent-emerald-glow)' : isRunning ? '0 0 8px var(--accent-amber-glow)' : 'none',
        }} />
        <span className="text-[10px] uppercase tracking-widest font-[family-name:var(--font-mono)]" style={{ color: 'var(--text-muted)' }}>
          {nodeData.type}
        </span>
      </div>

      <div className="text-sm font-semibold capitalize" style={{ color: 'var(--text-primary)' }}>
        {nodeData.label}
      </div>

      {nodeData.output && (
        <div className="mt-2 text-[11px] font-[family-name:var(--font-mono)] leading-relaxed overflow-hidden max-h-16" style={{ color: 'var(--text-secondary)' }}>
          {(() => {
            const decision = (nodeData.output as Record<string, unknown>).decision
            if (decision) {
              return (
                <span style={{
                  color: decision === 'EXECUTE' ? 'var(--accent-emerald)' : decision === 'WAIT' ? 'var(--accent-amber)' : 'var(--text-muted)',
                }}>
                  Decision: {String(decision)}
                </span>
              )
            }
            return JSON.stringify(nodeData.output).slice(0, 80) + '...'
          })()}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ background: 'var(--void-border)', width: 8, height: 8, border: 'none' }} />
    </motion.div>
  )
}
