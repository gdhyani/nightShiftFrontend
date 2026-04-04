import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { PortfolioHolding, PortfolioPosition, PortfolioMargins } from '@/types/api'

export function usePortfolioHoldings() {
  return useQuery({
    queryKey: ['portfolio-holdings'],
    queryFn: () => apiFetch<PortfolioHolding[]>('/api/portfolio/holdings'),
    refetchInterval: 10000,
  })
}

export function usePortfolioPositions() {
  return useQuery({
    queryKey: ['portfolio-positions'],
    queryFn: () => apiFetch<PortfolioPosition[]>('/api/portfolio/positions'),
    refetchInterval: 5000,
  })
}

export function usePortfolioMargins() {
  return useQuery({
    queryKey: ['portfolio-margins'],
    queryFn: () => apiFetch<PortfolioMargins>('/api/portfolio/margins'),
    refetchInterval: 10000,
  })
}
