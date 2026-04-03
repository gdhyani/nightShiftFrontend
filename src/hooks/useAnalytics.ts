import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'

export function usePerformance() {
  return useQuery({
    queryKey: ['performance'],
    queryFn: () => apiFetch<{ total_trades: number; wins: number; losses: number; win_rate: number; total_pnl: number }>('/api/analytics/performance'),
  })
}

export function useEquityCurve() {
  return useQuery({
    queryKey: ['equity-curve'],
    queryFn: () => apiFetch<Array<{ time: string | null; balance: number }>>('/api/analytics/equity-curve'),
  })
}
