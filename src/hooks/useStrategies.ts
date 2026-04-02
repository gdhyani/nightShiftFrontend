import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { Strategy, StrategyRun } from '@/types/api'

export function useStrategies() {
  return useQuery({
    queryKey: ['strategies'],
    queryFn: () => apiFetch<Strategy[]>('/api/strategies'),
  })
}

export function useStrategy(id: number) {
  return useQuery({
    queryKey: ['strategy', id],
    queryFn: () => apiFetch<Strategy>(`/api/strategies/${id}`),
  })
}

export function useStrategyRuns(id: number) {
  return useQuery({
    queryKey: ['strategy-runs', id],
    queryFn: () => apiFetch<StrategyRun[]>(`/api/strategies/${id}/runs`),
    refetchInterval: 10000,
  })
}

export function useToggleStrategy() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, enabled }: { id: number; enabled: boolean }) =>
      apiFetch<Strategy>(`/api/strategies/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ enabled }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] })
    },
  })
}
