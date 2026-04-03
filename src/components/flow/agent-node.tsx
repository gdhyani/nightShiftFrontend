'use client'

import { Handle, Position, type NodeProps } from '@xyflow/react'

interface AgentNodeData {
  label: string
  type: string
  status?: 'idle' | 'running' | 'done'
  output?: Record<string, unknown>
  [key: string]: unknown
}

export function AgentNode({ data }: NodeProps) {
  const nodeData = data as unknown as AgentNodeData
  const statusColor =
    nodeData.status === 'running' ? 'border-yellow-500 shadow-yellow-500/20'
    : nodeData.status === 'done' ? 'border-green-500 shadow-green-500/20'
    : 'border-zinc-700'

  return (
    <div className={`bg-zinc-900 border-2 ${statusColor} rounded-xl px-4 py-3 min-w-[180px] shadow-lg transition-all`}>
      <Handle type="target" position={Position.Top} className="!bg-zinc-500" />
      <div className="text-xs text-zinc-500 uppercase tracking-wider">{nodeData.type}</div>
      <div className="text-sm font-medium text-white mt-1">{nodeData.label}</div>
      {nodeData.output && (
        <div className="mt-2 text-xs text-zinc-400 truncate max-w-[200px]">
          {JSON.stringify(nodeData.output).slice(0, 60)}...
        </div>
      )}
      <Handle type="source" position={Position.Bottom} className="!bg-zinc-500" />
    </div>
  )
}
