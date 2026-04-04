'use client'

import { motion } from 'framer-motion'
import { useStoreSnapshot } from '@/hooks/useStoreSnapshot'
import { useState, useMemo } from 'react'

const SYMBOLS = ['EUR_USD', 'GBP_USD', 'USD_JPY']

const HERO_TF = 'H1'

function formatValue(v: number | null | undefined): string {
  if (v == null) return '\u2014'
  if (Math.abs(v) < 0.01) return v.toFixed(5)
  if (Math.abs(v) < 1) return v.toFixed(4)
  if (Math.abs(v) < 100) return v.toFixed(2)
  return v.toFixed(1)
}

function formatPrice(v: number | null | undefined): string {
  if (v == null) return '\u2014'
  if (Math.abs(v) < 10) return v.toFixed(5)
  return v.toFixed(2)
}

function rsiColor(v: number | null | undefined): string {
  if (v == null) return 'text-on-surface-variant'
  if (v >= 70) return 'text-error'
  if (v >= 60) return 'text-primary'
  if (v <= 30) return 'text-error'
  return 'text-on-surface'
}

function rsiBgWidth(v: number | null | undefined): string {
  if (v == null) return '0%'
  return `${Math.min(100, Math.max(0, v))}%`
}

function biasLabel(rsi: number | null | undefined): { text: string; cls: string } {
  if (rsi == null) return { text: 'N/A', cls: 'bg-surface-container-highest text-on-surface-variant' }
  if (rsi >= 60) return { text: 'BULLISH', cls: 'bg-primary-container/10 text-primary-container' }
  if (rsi <= 40) return { text: 'BEARISH', cls: 'bg-error-container/20 text-error' }
  return { text: 'NEUTRAL', cls: 'bg-surface-container-highest text-on-surface-variant' }
}

function MiniSparkline({ trend }: { trend: 'up' | 'down' | 'flat' }) {
  const paths: Record<string, string> = {
    up: 'M0 25 L10 20 L20 22 L30 15 L40 18 L50 10 L60 12 L70 5 L80 8 L90 2 L100 4',
    down: 'M0 5 L10 15 L20 12 L30 18 L40 14 L50 22 L60 20 L70 25 L80 22 L90 28 L100 26',
    flat: 'M0 15 L10 14 L20 16 L30 15 L40 16 L50 15 L60 14 L70 15 L80 16 L90 15 L100 16',
  }
  const colors: Record<string, string> = {
    up: '#ebffe2',
    down: '#ffb4ab',
    flat: '#a2e7ff',
  }
  return (
    <svg className="w-16 h-6" viewBox="0 0 100 30">
      <path
        d={paths[trend]}
        fill="none"
        stroke={colors[trend]}
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export default function DataStorePage() {
  const [selectedSymbol, setSelectedSymbol] = useState('EUR_USD')
  const [autoPause, setAutoPause] = useState(false)
  const { data: snapshot, isLoading } = useStoreSnapshot(selectedSymbol)

  // Also fetch all symbols for the multi-symbol table
  const eur = useStoreSnapshot('EUR_USD')
  const gbp = useStoreSnapshot('GBP_USD')
  const jpy = useStoreSnapshot('USD_JPY')

  const allSnapshots = useMemo(() => {
    return SYMBOLS.map((sym) => {
      const s = sym === 'EUR_USD' ? eur : sym === 'GBP_USD' ? gbp : jpy
      return { symbol: sym, snapshot: s.data, loading: s.isLoading }
    })
  }, [eur, gbp, jpy])

  const timeframes = useMemo(() => {
    if (!snapshot?.data) return []
    return Object.keys(snapshot.data).sort()
  }, [snapshot])

  const indicatorNames = useMemo(() => {
    if (!snapshot?.data) return []
    const names = new Set<string>()
    for (const tfData of Object.values(snapshot.data)) {
      for (const key of Object.keys(tfData)) {
        names.add(key)
      }
    }
    return Array.from(names).sort()
  }, [snapshot])

  // Hero stat values from selected symbol
  const heroRsi = snapshot?.data?.[HERO_TF]?.['rsi_14'] ?? null
  const heroAtr = snapshot?.data?.[HERO_TF]?.['atr_14'] ?? null
  const heroSma = snapshot?.data?.[HERO_TF]?.['sma_20'] ?? null
  const heroMacd = snapshot?.data?.[HERO_TF]?.['macd_signal'] ?? null

  const candleCount = useMemo(() => {
    if (!snapshot?.data) return 0
    return Object.keys(snapshot.data).length * Object.keys(Object.values(snapshot.data)[0] ?? {}).length
  }, [snapshot])

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end"
      >
        <div>
          <h1 className="text-4xl font-headline font-bold tracking-tighter text-on-surface">
            Data Store
          </h1>
          <p className="text-on-surface-variant mt-1 font-body">
            Real-time algorithmic indicator feed for primary trading pairs.
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-on-surface-variant">ENGINE_UPTIME</span>
            <span className="font-mono text-primary-container">--:--:--</span>
          </div>
          <div className="w-px h-10 bg-outline-variant/20 mx-2" />
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono text-on-surface-variant">LATENCY</span>
            <span className="font-mono text-secondary">{isLoading ? '...' : '~1ms'}</span>
          </div>
        </div>
      </motion.div>

      {/* Symbol selector + Auto-pause toggle */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {SYMBOLS.map((sym) => (
            <button
              key={sym}
              onClick={() => setSelectedSymbol(sym)}
              className={`px-4 py-2 rounded-lg text-sm font-mono transition-all ${
                selectedSymbol === sym
                  ? 'bg-primary-container/20 text-primary border border-primary-container/40'
                  : 'text-on-surface-variant border border-outline-variant/20 hover:bg-surface-container-high'
              }`}
            >
              {sym.replace('_', '/')}
            </button>
          ))}
        </div>
        <button
          onClick={() => setAutoPause((p) => !p)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono transition-all border ${
            autoPause
              ? 'border-error/40 bg-error-container/10 text-error'
              : 'border-primary-container/30 bg-primary-container/10 text-primary-container'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${autoPause ? 'bg-error' : 'bg-primary-container animate-pulse'}`} />
          {autoPause ? 'INGESTION PAUSED' : 'AUTO-INGEST ACTIVE'}
        </button>
      </div>

      {isLoading ? (
        <div className="text-on-surface-variant text-center py-12">Loading store data...</div>
      ) : !snapshot ? (
        <div className="text-on-surface-variant text-center py-12">No data available</div>
      ) : (
        <>
          {/* Stats Ribbon (Asymmetric Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Active Nodes / Candle count */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0 }}
              className="bg-surface-container-low p-6 rounded-xl relative overflow-hidden group"
            >
              <div className="relative z-10">
                <span className="text-xs font-mono text-on-surface-variant">ACTIVE_NODES</span>
                <div className="text-3xl font-headline font-bold text-on-surface mt-2">
                  {candleCount.toLocaleString()}
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity text-8xl">
                &#x2B22;
              </div>
            </motion.div>

            {/* Latest Price (SMA proxy) */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="bg-surface-container-low p-6 rounded-xl border-l-2 border-primary-container"
            >
              <span className="text-xs font-mono text-on-surface-variant">SMA_20_PRICE</span>
              <div className="text-3xl font-headline font-bold text-primary mt-2">
                {formatPrice(heroSma)}
              </div>
            </motion.div>

            {/* ATR */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface-container-low p-6 rounded-xl"
            >
              <span className="text-xs font-mono text-on-surface-variant">AVG_ATR_SIGNAL</span>
              <div className="text-3xl font-headline font-bold text-secondary mt-2">
                {formatValue(heroAtr)}
              </div>
            </motion.div>

            {/* AI Sentiment / Bias */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-tertiary-container/10 p-6 rounded-xl border border-tertiary-container/20"
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-mono text-tertiary-container">AI_SENTIMENT</span>
                <div className="w-2 h-2 rounded-full bg-tertiary-container animate-pulse shadow-[0_0_10px_rgba(236,212,255,0.5)]" />
              </div>
              <div className="text-3xl font-headline font-bold text-tertiary mt-2">
                {biasLabel(heroRsi).text}
              </div>
            </motion.div>
          </div>

          {/* High-Density Multi-Symbol Data Table */}
          <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-high border-b border-outline-variant/10">
                    <th className="px-6 py-4 text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">
                      Symbol
                    </th>
                    <th className="px-6 py-4 text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">
                      SMA (20)
                    </th>
                    <th className="px-6 py-4 text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">
                      EMA Trend
                    </th>
                    <th className="px-6 py-4 text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">
                      MACD Signal
                    </th>
                    <th className="px-6 py-4 text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">
                      ATR (14)
                    </th>
                    <th className="px-6 py-4 text-[10px] font-mono text-on-surface-variant uppercase tracking-widest text-center">
                      RSI (14)
                    </th>
                    <th className="px-6 py-4 text-[10px] font-mono text-on-surface-variant uppercase tracking-widest text-center">
                      Flow
                    </th>
                    <th className="px-6 py-4 text-[10px] font-mono text-on-surface-variant uppercase tracking-widest text-right">
                      Sync
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/5">
                  {allSnapshots.map(({ symbol, snapshot: snap, loading: rowLoading }) => {
                    const d = snap?.data?.[HERO_TF]
                    const sma20 = d?.['sma_20'] ?? null
                    const macdSig = d?.['macd_signal'] ?? null
                    const atr14 = d?.['atr_14'] ?? null
                    const rsi14 = d?.['rsi_14'] ?? null
                    const ema20 = d?.['ema_20'] ?? d?.['sma_20'] ?? null
                    const ema50 = d?.['ema_50'] ?? d?.['sma_50'] ?? null
                    const bias = biasLabel(rsi14)
                    const trend: 'up' | 'down' | 'flat' =
                      rsi14 == null ? 'flat' : rsi14 >= 55 ? 'up' : rsi14 <= 45 ? 'down' : 'flat'

                    const iconColors: Record<string, string> = {
                      EUR_USD: 'bg-emerald-500/20 text-emerald-500',
                      GBP_USD: 'bg-blue-500/20 text-blue-500',
                      USD_JPY: 'bg-orange-500/20 text-orange-500',
                    }

                    return (
                      <tr
                        key={symbol}
                        className="hover:bg-surface-container-low transition-colors group"
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded flex items-center justify-center ${iconColors[symbol] ?? 'bg-surface-container-high text-on-surface-variant'}`}>
                              <span className="text-lg font-bold font-mono">
                                {symbol.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-bold font-headline">
                                {symbol.replace('_', '/')}
                              </div>
                              <div className="text-[10px] font-mono text-on-surface-variant">
                                OANDA_FEED
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 font-mono text-sm font-medium">
                          {rowLoading ? '...' : formatPrice(sma20)}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <MiniSparkline trend={trend} />
                            <div className="flex flex-col text-[10px] font-mono">
                              <span className={trend === 'up' ? 'text-primary' : trend === 'down' ? 'text-error' : 'text-secondary'}>
                                E20: {formatValue(ema20)}
                              </span>
                              <span className="text-on-surface-variant">
                                E50: {formatValue(ema50)}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 font-mono text-xs text-secondary">
                          {rowLoading ? '...' : formatValue(macdSig)}
                        </td>
                        <td className="px-6 py-5 font-mono text-xs">
                          {rowLoading ? '...' : formatValue(atr14)}
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex flex-col items-center">
                            <span className={`text-sm font-mono font-bold ${rsiColor(rsi14)}`}>
                              {rsi14 != null ? rsi14.toFixed(1) : '\u2014'}
                            </span>
                            <div className="w-12 h-1 bg-surface-container rounded-full mt-1 overflow-hidden">
                              <div
                                className={`h-full ${rsi14 != null && (rsi14 >= 60 || rsi14 <= 40) ? (rsi14 >= 60 ? 'bg-primary-container' : 'bg-error') : 'bg-on-surface-variant'}`}
                                style={{ width: rsiBgWidth(rsi14) }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-center">
                          <span className={`px-2 py-1 text-[10px] font-bold rounded ${bias.cls}`}>
                            {bias.text}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className={`inline-flex items-center gap-2 px-2 py-1 rounded ${rowLoading ? 'bg-yellow-500/10' : 'bg-green-500/10'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${rowLoading ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
                            <span className={`text-[10px] font-mono ${rowLoading ? 'text-yellow-500' : 'text-green-500'}`}>
                              {rowLoading ? 'SYNC' : 'LIVE'}
                            </span>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detailed Indicator Table (per-symbol, per-timeframe) */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden">
            <div className="p-4 border-b border-outline-variant/5">
              <h2 className="font-headline font-semibold text-on-surface uppercase tracking-wider text-sm">
                {selectedSymbol.replace('_', '/')} \u2014 Full Indicator Snapshot
              </h2>
            </div>
            {timeframes.length === 0 ? (
              <div className="p-4 text-on-surface-variant text-sm text-center">No timeframe data</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant/5">
                      <th className="text-left px-6 py-3 text-[10px] uppercase tracking-widest font-mono text-on-surface-variant font-normal">
                        Indicator
                      </th>
                      {timeframes.map((tf) => (
                        <th
                          key={tf}
                          className="text-right px-6 py-3 text-[10px] uppercase tracking-widest font-mono text-on-surface-variant font-normal"
                        >
                          {tf}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {indicatorNames.map((name) => (
                      <tr key={name} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-6 py-3 font-mono text-xs text-on-surface">{name}</td>
                        {timeframes.map((tf) => {
                          const val = snapshot.data?.[tf]?.[name] ?? null
                          return (
                            <td key={tf} className="px-6 py-3 text-right font-mono tabular-nums text-xs text-on-surface-variant">
                              {formatValue(val)}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Neural Core Analysis + Recent Activity (Asymmetric 2/3 + 1/3) */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* AI Insight Panel */}
            <div className="lg:col-span-2 bg-surface-variant/60 backdrop-blur-2xl p-8 rounded-xl border border-tertiary-container/10 flex gap-8 items-start">
              <div className="flex-shrink-0 relative">
                <div className="w-16 h-16 rounded-full bg-tertiary-container flex items-center justify-center animate-pulse">
                  <span className="text-on-tertiary-container text-3xl">&#x1D4DD;</span>
                </div>
                <div className="absolute inset-0 rounded-full border border-tertiary-container/50 animate-ping" />
              </div>
              <div>
                <h3 className="text-tertiary text-xl font-headline font-bold mb-3">
                  Neural Core Analysis
                </h3>
                <p className="text-on-surface-variant leading-relaxed text-sm">
                  Analysis for{' '}
                  <span className="text-primary-fixed">{selectedSymbol.replace('_', '/')}</span>.
                  {(() => {
                    const rsi = heroRsi
                    const atr = heroAtr
                    const macd = heroMacd
                    const parts: string[] = []

                    if (rsi != null) {
                      if (rsi > 70) parts.push(`RSI at ${rsi.toFixed(1)} signals overbought — potential reversal imminent.`)
                      else if (rsi > 60) parts.push(`RSI at ${rsi.toFixed(1)} shows bullish momentum with room before overbought.`)
                      else if (rsi < 30) parts.push(`RSI at ${rsi.toFixed(1)} signals oversold territory — watch for bounce.`)
                      else if (rsi < 40) parts.push(`RSI at ${rsi.toFixed(1)} shows bearish pressure building.`)
                      else parts.push(`RSI at ${rsi.toFixed(1)} in neutral consolidation zone.`)
                    }

                    if (atr != null) {
                      parts.push(`ATR(14) reading ${formatValue(atr)} indicates ${atr > 0.005 ? 'elevated volatility' : 'compressed range'}.`)
                    }

                    if (macd != null) {
                      parts.push(`MACD signal line at ${formatValue(macd)} — ${macd > 0 ? 'bullish cross active' : 'bearish divergence detected'}.`)
                    }

                    if (parts.length === 0) return ' Awaiting indicator data for analysis.'
                    return ' ' + parts.join(' ')
                  })()}
                </p>
                <div className="mt-6 flex gap-4">
                  <button className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity">
                    EXECUTE AUTO-HEDGE
                  </button>
                  <button className="border border-outline-variant/30 text-on-surface-variant px-6 py-2 rounded-lg font-bold text-sm hover:bg-surface-container transition-colors">
                    VIEW LOGS
                  </button>
                </div>
              </div>
            </div>

            {/* Recent Node Activity */}
            <div className="bg-surface-container-low p-6 rounded-xl space-y-4">
              <h4 className="text-xs font-mono text-on-surface-variant uppercase tracking-widest">
                Recent Node Activity
              </h4>
              <div className="space-y-4">
                {[
                  { label: `${selectedSymbol}_SMA_CROSS`, color: 'bg-primary-container', time: 'Just now' },
                  { label: `RSI_SIGNAL_UPDATE`, color: 'bg-secondary', time: '2 minutes ago' },
                  { label: `ATR_RECALC`, color: 'bg-primary-container', time: '5 minutes ago' },
                  { label: `STORE_SNAPSHOT_SYNC`, color: 'bg-secondary', time: '14 minutes ago' },
                ].map((evt) => (
                  <div key={evt.label} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${evt.color}`} />
                    <div className="flex-1">
                      <div className="text-xs font-bold font-headline text-on-surface">{evt.label}</div>
                      <div className="text-[10px] font-mono text-on-surface-variant">{evt.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 py-2 border border-outline-variant/20 rounded text-[10px] font-mono text-on-surface-variant hover:bg-surface-container transition-colors">
                EXPORT ALL EVENT DATA (.JSON)
              </button>
            </div>
          </div>

          {/* Updated timestamp */}
          {snapshot.updated_at && (
            <div className="text-on-surface-variant text-[10px] font-mono text-right">
              Last updated: {new Date(snapshot.updated_at).toLocaleString()}
            </div>
          )}
        </>
      )}
    </div>
  )
}
