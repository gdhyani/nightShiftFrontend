import { useMutation } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { ChargeBreakdown } from '@/types/api'

export function useCalculateCharges() {
  return useMutation({
    mutationFn: (data: { symbol: string; side: string; qty: number; price: number; product?: string }) =>
      apiFetch<ChargeBreakdown>('/api/charges/calculate', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
  })
}
