import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'

interface Account {
  id: number
  balance: number
  equity: number
  margin_used: number
  daily_loss_limit: number
  max_drawdown: number
  max_position_size: number
  risk_per_trade: number
  settings: Record<string, unknown>
  updated_at: string
}

export type { Account }

export function useAccount() {
  return useQuery({
    queryKey: ['account'],
    queryFn: () => apiFetch<Account>('/api/account'),
  })
}
