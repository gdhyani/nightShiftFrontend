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

  const activeClass = isRunning
    ? 'border-amber-400/60 shadow-[0_0_16px_rgba(251,191,36,0.4)]'
    : isDone
      ? 'border-primary-container/40 shadow-[0_0_10px_rgba(0,255,65,0.4)]'
      : 'border-outline-variant/20'

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`relative min-w-[200px] bg-surface-container-high border rounded-xl p-4 ${activeClass}`}
    >
      <Handle type="target" position={Position.Top} className="!bg-outline-variant/40 !w-2 !h-2 !border-none" />

      <div className="flex items-center gap-2 mb-2">
        <div className={`w-2 h-2 rounded-full ${
          isDone
            ? 'bg-primary-container shadow-[0_0_8px_rgba(0,255,65,0.5)]'
            : isRunning
              ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]'
              : 'bg-on-surface-variant/40'
        }`} />
        <span className="text-[10px] uppercase tracking-widest font-mono text-on-surface-variant">
          {nodeData.type}
        </span>
      </div>

      <div className="font-headline font-semibold text-sm text-on-surface capitalize">
        {nodeData.label}
      </div>

      {nodeData.output && (
        <div className="mt-2 text-[11px] font-mono leading-relaxed overflow-hidden max-h-16 text-on-surface-variant">
          {(() => {
            const decision = (nodeData.output as Record<string, unknown>).decision
            if (decision) {
              return (
                <span className={
                  decision === 'EXECUTE'
                    ? 'text-primary-container'
                    : decision === 'WAIT'
                      ? 'text-amber-400'
                      : 'text-on-surface-variant/60'
                }>
                  Decision: {String(decision)}
                </span>
              )
            }
            return JSON.stringify(nodeData.output).slice(0, 80) + '...'
          })()}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-outline-variant/40 !w-2 !h-2 !border-none" />
    </motion.div>
  )
}
