import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { StoreSnapshot } from '@/types/api'

export function useStoreSnapshot(symbol: string) {
  return useQuery({
    queryKey: ['store', symbol],
    queryFn: () => apiFetch<StoreSnapshot>(`/api/store/${symbol}`),
    enabled: !!symbol,
  })
}
