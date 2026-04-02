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

export interface Strategy {
  id: number
  name: string
  symbols: string
  enabled: boolean
  schedule_interval: number
  event_triggers: string | null
  pipeline_config: Record<string, unknown>
  created_at: string
  updated_at: string
}

export interface StrategyRun {
  id: number
  strategy_id: number
  symbol: string
  stages: Record<string, unknown>
  decision: string
  trade_id: number | null
  created_at: string
}

export interface Trade {
  id: number
  strategy_id: number | null
  symbol: string
  direction: string
  entry_price: number | null
  exit_price: number | null
  stop_loss: number | null
  take_profit: number | null
  quantity: number | null
  status: string
  pnl: number | null
  reasoning: Record<string, unknown> | null
  opened_at: string | null
  closed_at: string | null
  created_at: string
}

export interface Position {
  id: number
  trade_id: number
  symbol: string
  direction: string
  entry_price: number
  current_price: number | null
  stop_loss: number | null
  take_profit: number | null
  quantity: number
  unrealized_pnl: number | null
  status: string
  opened_at: string
}
