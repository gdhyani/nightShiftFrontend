import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { Candle } from '@/types/api'

export function useCandles(symbol: string, timeframe: string, limit = 200) {
  return useQuery({
    queryKey: ['candles', symbol, timeframe, limit],
    queryFn: () => apiFetch<Candle[]>(`/api/candles/${symbol}/${timeframe}?limit=${limit}`),
  })
}
