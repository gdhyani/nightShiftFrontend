'use client'

import { ReactFlow, Background, Controls, type Node, type Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useStrategyRuns } from '@/hooks/useStrategies'
import { AgentNode } from './agent-node'

const nodeTypes = { agent: AgentNode }

function buildFlowFromRun(run: Record<string, unknown> | null): { nodes: Node[]; edges: Edge[] } {
  if (!run) {
    return {
      nodes: [
        { id: 'analyst', type: 'agent', position: { x: 250, y: 50 }, data: { label: 'Analyst', type: 'tier3', status: 'idle' } },
        { id: 'evaluator', type: 'agent', position: { x: 250, y: 250 }, data: { label: 'Evaluator', type: 'tier3', status: 'idle' } },
      ],
      edges: [{ id: 'e-analyst-evaluator', source: 'analyst', target: 'evaluator', animated: true, style: { stroke: '#00ff41', strokeWidth: 2, strokeDasharray: '5 5' } }],
    }
  }
  const stagesData = (run.stages as Record<string, unknown>)?.stages as Array<{ agent: string; output: Record<string, unknown> }> || []
  const nodes: Node[] = stagesData.map((stage, i) => ({
    id: stage.agent, type: 'agent', position: { x: 250, y: 50 + i * 200 },
    data: { label: stage.agent.replace(/_/g, ' '), type: 'tier3', status: 'done' as const, output: stage.output },
  }))
  const edges: Edge[] = []
  for (let i = 0; i < nodes.length - 1; i++) {
    edges.push({
      id: `e-${nodes[i].id}-${nodes[i + 1].id}`, source: nodes[i].id, target: nodes[i + 1].id,
      animated: true, style: { stroke: '#00ff41', strokeWidth: 2, strokeDasharray: '5 5' },
    })
  }
  return { nodes, edges }
}

interface Props { strategyId: number }

export function PipelineFlow({ strategyId }: Props) {
  const { data: runs } = useStrategyRuns(strategyId)
  const latestRun = runs?.[0] ?? null
  const { nodes, edges } = buildFlowFromRun(latestRun as unknown as Record<string, unknown>)

  return (
    <div className="h-[600px] rounded-2xl overflow-hidden bg-background border border-outline-variant/10">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        style={{ background: '#131314' }}
      >
        <Background color="#2a2a2b" gap={24} size={1} />
        <Controls className="!bg-surface-container-high !border-outline-variant/20 !rounded-xl [&>button]:!bg-surface-container-high [&>button]:!border-outline-variant/10 [&>button]:!text-on-surface-variant [&>button:hover]:!bg-surface-container-highest" />
      </ReactFlow>
    </div>
  )
}
