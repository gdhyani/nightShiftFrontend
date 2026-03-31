export interface Candle {
  id: number
  symbol: string
  timeframe: string
  timestamp: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}

export interface StoreSnapshot {
  symbol: string
  data: Record<string, number | null>
  updated_at: string
}
