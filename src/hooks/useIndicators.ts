import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { Indicator } from '@/types/api'

export function useIndicators(symbol: string, timeframe: string, names?: string[]) {
  const namesParam = names ? `?names=${names.join(',')}` : ''
  return useQuery({
    queryKey: ['indicators', symbol, timeframe, names],
    queryFn: () => apiFetch<Indicator[]>(`/api/indicators/${symbol}/${timeframe}${namesParam}`),
    enabled: !!symbol && !!timeframe,
  })
}
