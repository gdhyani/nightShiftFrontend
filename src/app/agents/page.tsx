'use client'

import { useState } from 'react'
import { useAgents, useAgentInsights } from '@/hooks/useAgentInsights'
import { AgentCard } from '@/components/agents/agent-card'

const SYMBOLS = ['EUR_USD', 'GBP_USD', 'USD_JPY']

export default function AgentInsightsPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('EUR_USD')
  const { data: agents } = useAgents()
  const { data: insights } = useAgentInsights(selectedSymbol)

  const getLatestInsight = (agentName: string) => {
    return insights?.find((i) => i.agent_name === agentName) ?? null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agent Insights</h1>
          <p className="text-zinc-500 mt-1">Live Tier 1 & 2 agent outputs</p>
        </div>
        <select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="bg-zinc-900 border border-zinc-700 rounded px-3 py-1.5 text-sm text-white"
        >
          {SYMBOLS.map((s) => (
            <option key={s} value={s}>{s.replace('_', '/')}</option>
          ))}
        </select>
      </div>

      {agents && (
        <>
          <div>
            <h2 className="text-sm font-medium text-zinc-400 mb-3">Tier 1 — Data Agents</h2>
            <div className="grid grid-cols-2 gap-3">
              {agents.filter((a) => a.tier === 1).map((agent) => (
                <AgentCard key={agent.name} agent={agent} latestInsight={getLatestInsight(agent.name)} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-sm font-medium text-zinc-400 mb-3">Tier 2 — Analysis Agents</h2>
            <div className="grid grid-cols-2 gap-3">
              {agents.filter((a) => a.tier === 2).map((agent) => (
                <AgentCard key={agent.name} agent={agent} latestInsight={getLatestInsight(agent.name)} />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
