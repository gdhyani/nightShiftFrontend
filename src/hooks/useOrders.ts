import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { PlaceOrderRequest, PlaceOrderResponse } from '@/types/api'

export function usePlaceOrder() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: PlaceOrderRequest) =>
      apiFetch<PlaceOrderResponse>('/api/orders', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['trades'] })
      qc.invalidateQueries({ queryKey: ['positions'] })
      qc.invalidateQueries({ queryKey: ['portfolio-positions'] })
    },
  })
}
