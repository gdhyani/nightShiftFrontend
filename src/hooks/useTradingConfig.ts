import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { TradingConfig } from '@/types/api'

export function useTradingConfig() {
  return useQuery({
    queryKey: ['trading-config'],
    queryFn: () => apiFetch<TradingConfig>('/api/trading/config'),
    refetchInterval: 30000,
  })
}

export function useAuthStatus() {
  return useQuery({
    queryKey: ['auth-status'],
    queryFn: () => apiFetch<TradingConfig>('/api/auth/upstox/status'),
    refetchInterval: 10000,
  })
}

export function useSwitchMode() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (mode: 'paper' | 'live') =>
      apiFetch<{ mode: string }>('/api/trading/mode', {
        method: 'PUT',
        body: JSON.stringify({ mode }),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trading-config'] })
      qc.invalidateQueries({ queryKey: ['auth-status'] })
    },
  })
}

export function useUpstoxLogin() {
  return useQuery({
    queryKey: ['upstox-login'],
    queryFn: () => apiFetch<{ login_url: string }>('/api/auth/upstox/login'),
    enabled: false,
  })
}

export function useRequestDailyToken() {
  return useMutation({
    mutationFn: () =>
      apiFetch('/api/auth/upstox/token-request', { method: 'POST' }),
  })
}
