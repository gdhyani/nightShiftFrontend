import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { InstrumentResult } from '@/types/api'

export function useInstrumentSearch(query: string) {
  return useQuery({
    queryKey: ['instruments', query],
    queryFn: () => apiFetch<InstrumentResult[]>(`/api/instruments/search?q=${encodeURIComponent(query)}`),
    enabled: query.length >= 2,
  })
}

export function useInstrument(key: string) {
  return useQuery({
    queryKey: ['instrument', key],
    queryFn: () => apiFetch<InstrumentResult>(`/api/instruments/${encodeURIComponent(key)}`),
    enabled: !!key,
  })
}
