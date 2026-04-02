import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { AgentDef, AgentInsight } from '@/types/api'

export function useAgents() {
  return useQuery({
    queryKey: ['agents'],
    queryFn: () => apiFetch<AgentDef[]>('/api/agents'),
  })
}

export function useAgentInsights(symbol?: string, agentName?: string) {
  const params = new URLSearchParams()
  if (symbol) params.set('symbol', symbol)
  if (agentName) params.set('agent_name', agentName)
  const qs = params.toString() ? `?${params.toString()}` : ''
  return useQuery({
    queryKey: ['agent-insights', symbol, agentName],
    queryFn: () => apiFetch<AgentInsight[]>(`/api/agents/insights${qs}`),
    refetchInterval: 10000,
  })
}
