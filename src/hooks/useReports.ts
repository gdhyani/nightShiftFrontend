import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'

interface DailyReport {
  id: number
  date: string
  summary: string
  trades_count: number
  wins: number
  losses: number
  total_pnl: number
  data: Record<string, unknown>
  created_at: string
}

export type { DailyReport }

export function useReports() {
  return useQuery({
    queryKey: ['reports'],
    queryFn: () => apiFetch<DailyReport[]>('/api/reports'),
  })
}
