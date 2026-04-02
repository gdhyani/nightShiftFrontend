import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { Trade, Position } from '@/types/api'

export function useTrades(filters?: { strategy_id?: number; symbol?: string; status?: string }) {
  const params = new URLSearchParams()
  if (filters?.strategy_id) params.set('strategy_id', String(filters.strategy_id))
  if (filters?.symbol) params.set('symbol', filters.symbol)
  if (filters?.status) params.set('status', filters.status)
  const qs = params.toString() ? `?${params.toString()}` : ''
  return useQuery({
    queryKey: ['trades', filters],
    queryFn: () => apiFetch<Trade[]>(`/api/trades${qs}`),
    refetchInterval: 10000,
  })
}

export function useTrade(id: number) {
  return useQuery({
    queryKey: ['trade', id],
    queryFn: () => apiFetch<Trade>(`/api/trades/${id}`),
  })
}

export function usePositions() {
  return useQuery({
    queryKey: ['positions'],
    queryFn: () => apiFetch<Position[]>('/api/positions'),
    refetchInterval: 5000,
  })
}
