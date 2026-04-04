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

// Upstox Trading Types
export interface TradingConfig {
  daily: 'active' | 'expired' | 'missing'
  sandbox: 'active' | 'expired' | 'missing'
  mode: 'paper' | 'live'
  client_id_set: boolean
}

export interface InstrumentResult {
  id: number
  instrument_key: string
  symbol: string
  name: string
  exchange: string
  segment: string
  isin: string | null
  lot_size: number
  tick_size: number
  instrument_type: string | null
  expiry: string | null
  strike_price: number | null
  option_type: string | null
  updated_at: string
}

export interface PlaceOrderRequest {
  symbol: string
  side: 'BUY' | 'SELL'
  qty: number
  order_type: 'MARKET' | 'LIMIT'
  price: number
  product: 'D' | 'I'
}

export interface PlaceOrderResponse {
  order_id: number
  status: string
  symbol: string
  side: string
  qty: number
  fill_price: number
  charges: ChargeBreakdown
  source: string
}

export interface ChargeBreakdown {
  brokerage: number
  stt: number
  exchange_charges: number
  gst: number
  stamp_duty: number
  sebi_fee: number
  total_charges: number
  net_amount: number
}

export interface PortfolioHolding {
  symbol: string
  quantity: number
  average_price: number
  pnl: number
}

export interface PortfolioPosition {
  symbol: string
  direction: string
  entry_price: number
  current_price: number
  quantity: number
  unrealized_pnl: number
}

export interface PortfolioMargins {
  balance: number
  equity: number
  margin_used: number
  available: number
}
