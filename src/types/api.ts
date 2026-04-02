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
  data: Record<string, Record<string, number | null>>
  updated_at: string
}

export interface Indicator {
  id: number
  symbol: string
  timeframe: string
  timestamp: string
  name: string
  value: number
}

export interface AgentDef {
  name: string
  insight_type: string
  interval_seconds: number
  tier: number
}

export interface AgentInsight {
  id: number
  agent_name: string
  symbol: string
  timeframe: string | null
  insight_type: string
  data: Record<string, unknown>
  confidence: number | null
  created_at: string
  expires_at: string
}
