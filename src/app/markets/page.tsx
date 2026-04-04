'use client'

import { useState } from 'react'
import { useAtom, useAtomValue } from 'jotai'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { activeSymbolAtom, activeTimeframeAtom, livePricesAtom } from '@/stores/app'
import { CandlestickChart } from '@/components/charts/candlestick-chart'
import { useStoreSnapshot } from '@/hooks/useStoreSnapshot'
import { useStrategies } from '@/hooks/useStrategies'
import { useTrades } from '@/hooks/useTrades'
import { PriceCell } from '@/components/markets/price-cell'

const SYMBOLS = ['NSE_EQ|INE848E01016', 'NSE_EQ|INE040A01034', 'NSE_EQ|INE467B01029']

const TIMEFRAMES = [
  { label: '1m', value: 'M1' },
  { label: '5m', value: 'M5' },
  { label: '15m', value: 'M15' },
  { label: '1H', value: 'H1' },
  { label: '4H', value: 'H4' },
  { label: '1D', value: 'D' },
]

function formatSymbol(symbol: string) {
  if (symbol.includes('|')) {
    const code = symbol.split('|').pop() ?? symbol
    return code.replace(/_/g, ' / ')
  }
  return symbol.replace('_', ' / ')
}

/* ═══ CHART HEADER BAR ═══ */
function ChartHeaderBar() {
  const [symbol, setSymbol] = useAtom(activeSymbolAtom)
  const [timeframe, setTimeframe] = useAtom(activeTimeframeAtom)
  const livePrices = useAtomValue(livePricesAtom)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const liveCandle = livePrices[symbol]
  const price = liveCandle?.close ?? null
  const open = liveCandle?.open ?? null
  const change = price != null && open != null && open !== 0
    ? ((price - open) / open) * 100
    : null

  return (
    <div className="h-14 bg-surface-container-low border-b border-outline-variant/10 flex items-center justify-between px-4">
      {/* Left: symbol + price */}
      <div className="flex items-center gap-4">
        {/* Symbol Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 font-headline text-xl font-bold text-primary"
          >
            {formatSymbol(symbol)}
            <svg className="w-4 h-4 text-on-surface-variant" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-surface-container-high rounded-lg border border-outline-variant/20 shadow-xl overflow-hidden min-w-[200px]">
              {SYMBOLS.map((s) => (
                <button
                  key={s}
                  onClick={() => { setSymbol(s); setDropdownOpen(false) }}
                  className={`block w-full text-left px-4 py-2.5 text-sm font-headline transition-colors ${
                    s === symbol
                      ? 'bg-primary-container/10 text-primary font-bold'
                      : 'text-on-surface hover:bg-surface-container-highest'
                  }`}
                >
                  {formatSymbol(s)}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Price + Change */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-secondary tabular-nums">
            {price != null ? price.toFixed(2) : '—'}
          </span>
          {change != null && (
            <span className={`text-xs font-mono px-1.5 py-0.5 rounded ${
              change >= 0
                ? 'bg-primary-container/10 text-primary-container'
                : 'bg-error/10 text-error'
            }`}>
              {change >= 0 ? '+' : ''}{change.toFixed(2)}%
            </span>
          )}
        </div>
      </div>

      {/* Right: Timeframe buttons */}
      <div className="bg-surface-container-highest rounded p-0.5 flex gap-0.5">
        {TIMEFRAMES.map((tf) => (
          <button
            key={tf.value}
            onClick={() => setTimeframe(tf.value)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              timeframe === tf.value
                ? 'bg-surface-container-low text-primary'
                : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ═══ FLOATING INDICATOR TOGGLE PANEL ═══ */
function IndicatorOverlayPanel() {
  const [overlays, setOverlays] = useState({
    ema20: true,
    ema50: true,
    vwap: false,
  })

  const toggleOverlay = (key: keyof typeof overlays) => {
    setOverlays((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const indicators = [
    { key: 'ema20' as const, label: 'EMA(20)', color: 'bg-primary' },
    { key: 'ema50' as const, label: 'EMA(50)', color: 'bg-tertiary' },
    { key: 'vwap' as const, label: 'VWAP', color: 'bg-secondary' },
  ]

  return (
    <div className="glass-panel p-4 rounded-xl border border-outline-variant/20 w-56">
      <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">
        Visible Overlays
      </h3>
      <div className="space-y-2.5">
        {indicators.map((ind) => (
          <label key={ind.key} className="flex items-center justify-between cursor-pointer group">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${ind.color}`} />
              <span className="text-sm text-on-surface group-hover:text-primary transition-colors">
                {ind.label}
              </span>
            </div>
            <button
              onClick={() => toggleOverlay(ind.key)}
              className={`relative w-8 h-4.5 rounded-full transition-colors ${
                overlays[ind.key] ? 'bg-primary' : 'bg-surface-container-highest'
              }`}
            >
              <span
                className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-on-primary transition-transform ${
                  overlays[ind.key] ? 'left-[calc(100%-1rem)]' : 'left-0.5'
                }`}
              />
            </button>
          </label>
        ))}
      </div>
    </div>
  )
}

/* ═══ MACD HISTOGRAM ═══ */
function MacdHistogram() {
  // Placeholder MACD bars
  const bars = Array.from({ length: 60 }, (_, i) => {
    const val = Math.sin(i * 0.3) * (1 + Math.sin(i * 0.1) * 0.5)
    return val
  })
  const maxAbs = Math.max(...bars.map(Math.abs))

  return (
    <div className="h-32 border-t border-outline-variant/10 bg-surface-container-lowest px-4 py-2 flex flex-col">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">MACD</span>
        <span className="text-[10px] font-mono text-on-surface-variant/60">12, 26, 9</span>
      </div>
      <div className="flex-1 flex items-end gap-px">
        {bars.map((val, i) => {
          const pct = maxAbs > 0 ? (Math.abs(val) / maxAbs) * 100 : 0
          const isPositive = val >= 0
          return (
            <div
              key={i}
              className="flex-1 flex flex-col justify-end h-full"
            >
              {isPositive ? (
                <div
                  className="bg-primary-container/40 rounded-t-sm"
                  style={{ height: `${pct * 0.5}%` }}
                />
              ) : (
                <div className="flex-1" />
              )}
              {!isPositive && (
                <div
                  className="bg-error/40 rounded-b-sm"
                  style={{ height: `${pct * 0.5}%` }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ═══ STRATEGY ALIGNMENT PANEL ═══ */
function StrategyAlignmentPanel() {
  const { data: strategies, isLoading } = useStrategies()

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="h-4 bg-surface-container-highest rounded animate-pulse" />
      </div>
    )
  }

  const items = strategies ?? []

  return (
    <div className="p-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">
        Strategy Alignment
      </h3>
      <div className="space-y-3">
        {items.length === 0 && (
          <p className="text-xs text-on-surface-variant">No strategies configured</p>
        )}
        {items.map((strategy) => {
          // Derive a pseudo-confidence from the strategy for display
          const confidence = strategy.enabled ? 72 : 35
          const bias = strategy.enabled ? 'LONG' : 'NEUTRAL'

          return (
            <Link
              key={strategy.id}
              href={`/strategies/${strategy.id}`}
              className="block p-4 bg-surface-container-lowest rounded-lg border border-outline-variant/10 hover:border-outline-variant/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-primary truncate">{strategy.name}</span>
                <span className="text-[10px] font-mono text-on-surface-variant">
                  {strategy.schedule_interval}s
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary-container/10 text-primary-container border border-primary-container/20 font-medium">
                  {bias}
                </span>
                <span className="text-[10px] font-mono text-on-surface-variant">
                  {confidence}% conf
                </span>
              </div>
              {/* Confidence bar */}
              <div className="h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${confidence}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`h-full rounded-full ${
                    confidence >= 60 ? 'bg-primary' : confidence >= 40 ? 'bg-secondary' : 'bg-error'
                  }`}
                />
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

/* ═══ ORDER HISTORY PANEL ═══ */
function OrderHistoryPanel() {
  const { data: trades, isLoading } = useTrades({ status: 'closed' })

  const recentTrades = (trades ?? []).slice(0, 8)

  return (
    <div className="p-4 border-t border-outline-variant/10">
      <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">
        Order History
      </h3>
      {isLoading ? (
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-surface-container-highest rounded animate-pulse" />
          ))}
        </div>
      ) : recentTrades.length === 0 ? (
        <p className="text-xs text-on-surface-variant">No recent trades</p>
      ) : (
        <div className="space-y-1.5">
          {recentTrades.map((trade) => (
            <Link
              key={trade.id}
              href={`/trades/${trade.id}`}
              className="flex items-center justify-between p-2.5 rounded-lg hover:bg-surface-container-lowest transition-colors group"
            >
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  trade.direction === 'LONG'
                    ? 'bg-primary-container/10 text-primary-container'
                    : 'bg-error/10 text-error'
                }`}>
                  {trade.direction === 'LONG' ? 'BUY' : 'SELL'}
                </span>
                <span className="text-xs text-on-surface font-mono truncate max-w-[80px]">
                  {formatSymbol(trade.symbol)}
                </span>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-on-surface tabular-nums">
                  {trade.entry_price?.toFixed(2) ?? '—'}
                </div>
                <div className={`text-[10px] font-mono tabular-nums ${
                  (trade.pnl ?? 0) >= 0 ? 'text-primary-container' : 'text-error'
                }`}>
                  {trade.pnl != null ? `${trade.pnl >= 0 ? '+' : ''}${trade.pnl.toFixed(2)}` : '—'}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

/* ═══ LIVE WATCHLIST (COMPACT) ═══ */
function CompactWatchlist() {
  const livePrices = useAtomValue(livePricesAtom)
  const [, setSymbol] = useAtom(activeSymbolAtom)

  return (
    <div className="p-4 border-t border-outline-variant/10">
      <h3 className="text-xs font-bold uppercase tracking-wider text-on-surface-variant mb-3">
        Live Watchlist
      </h3>
      <div className="space-y-1">
        {SYMBOLS.map((s) => {
          const candle = livePrices[s]
          const price = candle?.close ?? null
          return (
            <button
              key={s}
              onClick={() => setSymbol(s)}
              className="flex items-center justify-between w-full px-2.5 py-2 rounded-lg hover:bg-surface-container-lowest transition-colors text-left"
            >
              <span className="text-xs font-headline font-semibold text-on-surface">
                {formatSymbol(s)}
              </span>
              <PriceCell price={price} />
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ═══ AI ORB ═══ */
function AiOrb() {
  return (
    <div className="p-4 border-t border-outline-variant/10 flex justify-center">
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500/30 to-purple-800/40 border border-purple-500/20 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-purple-500/50 animate-pulse" />
        </div>
        <span className="text-[9px] text-on-surface-variant/60 mt-1.5 block text-center">AI</span>
      </div>
    </div>
  )
}

/* ═══ RIGHT SIDEBAR ═══ */
function RightSidebar() {
  return (
    <aside className="w-96 border-l border-outline-variant/10 bg-surface-container-low overflow-y-auto hidden lg:flex flex-col">
      <StrategyAlignmentPanel />
      <OrderHistoryPanel />
      <CompactWatchlist />
      <div className="flex-1" />
      <AiOrb />
    </aside>
  )
}

/* ═══ MAIN MARKETS PAGE ═══ */
export default function MarketsPage() {
  const symbol = useAtomValue(activeSymbolAtom)
  const timeframe = useAtomValue(activeTimeframeAtom)

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] -m-6">
      {/* Chart Header Bar */}
      <ChartHeaderBar />

      {/* Main area: chart + sidebar */}
      <div className="flex flex-1 min-h-0">
        {/* Chart column */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Chart area with floating overlay */}
          <div className="flex-1 bg-surface-container-lowest p-4 relative min-h-0">
            {/* Floating Indicator Toggle */}
            <div className="absolute top-6 left-6 z-10">
              <IndicatorOverlayPanel />
            </div>
            {/* Candlestick Chart */}
            <div className="w-full h-full">
              <CandlestickChart symbol={symbol} timeframe={timeframe} height={480} />
            </div>
          </div>

          {/* MACD Histogram */}
          <MacdHistogram />
        </div>

        {/* Right Sidebar */}
        <RightSidebar />
      </div>
    </div>
  )
}
