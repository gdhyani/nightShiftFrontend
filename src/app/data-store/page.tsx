'use client'

import { motion } from 'framer-motion'
import { useStoreSnapshot } from '@/hooks/useStoreSnapshot'
import { useState, useMemo } from 'react'

const SYMBOLS = ['EUR_USD', 'GBP_USD', 'USD_JPY']

const HERO_INDICATORS: { key: string; label: string; tf: string }[] = [
  { key: 'rsi_14', label: 'RSI (14)', tf: 'H1' },
  { key: 'atr_14', label: 'ATR (14)', tf: 'H1' },
  { key: 'sma_20', label: 'SMA (20)', tf: 'H1' },
  { key: 'macd_signal', label: 'MACD Signal', tf: 'H1' },
]

function formatValue(v: number | null | undefined): string {
  if (v == null) return '—'
  if (Math.abs(v) < 0.01) return v.toFixed(5)
  if (Math.abs(v) < 1) return v.toFixed(4)
  if (Math.abs(v) < 100) return v.toFixed(2)
  return v.toFixed(1)
}

export default function DataStorePage() {
  const [selectedSymbol, setSelectedSymbol] = useState('EUR_USD')
  const { data: snapshot, isLoading } = useStoreSnapshot(selectedSymbol)

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

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-headline font-bold uppercase tracking-tight text-on-surface">
          Data Store
        </h1>
        <p className="text-on-surface-variant font-light mt-1">
          Real-time algorithmic indicator feed for primary trading pairs
        </p>
      </motion.div>

      {/* Symbol selector */}
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

      {isLoading ? (
        <div className="text-on-surface-variant text-center py-12">Loading store data...</div>
      ) : !snapshot ? (
        <div className="text-on-surface-variant text-center py-12">No data available</div>
      ) : (
        <>
          {/* Hero Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {HERO_INDICATORS.map((ind) => {
              const value = snapshot.data?.[ind.tf]?.[ind.key] ?? null
              return (
                <motion.div
                  key={ind.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-surface-container-lowest rounded-xl p-5 border border-outline-variant/10"
                >
                  <div className="text-on-surface-variant text-[10px] uppercase tracking-[0.2em] font-mono">
                    {ind.label}
                  </div>
                  <div className="font-headline font-bold text-2xl tabular-nums text-on-surface mt-1">
                    {formatValue(value)}
                  </div>
                  <div className="text-on-surface-variant text-[10px] font-mono mt-1">{ind.tf}</div>
                </motion.div>
              )
            })}
          </div>

          {/* Indicator Table */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/10 overflow-hidden">
            <div className="p-4 border-b border-outline-variant/5">
              <h2 className="font-headline font-semibold text-on-surface uppercase tracking-wider text-sm">
                Indicator Snapshots
              </h2>
            </div>
            {timeframes.length === 0 ? (
              <div className="p-4 text-on-surface-variant text-sm text-center">No timeframe data</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-outline-variant/5">
                      <th className="text-left p-3 text-on-surface-variant text-[10px] uppercase tracking-[0.2em] font-mono font-normal">
                        Indicator
                      </th>
                      {timeframes.map((tf) => (
                        <th
                          key={tf}
                          className="text-right p-3 text-on-surface-variant text-[10px] uppercase tracking-[0.2em] font-mono font-normal"
                        >
                          {tf}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/5">
                    {indicatorNames.map((name) => (
                      <tr key={name} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="p-3 font-mono text-xs text-on-surface">{name}</td>
                        {timeframes.map((tf) => {
                          const val = snapshot.data?.[tf]?.[name] ?? null
                          return (
                            <td key={tf} className="p-3 text-right font-mono tabular-nums text-xs text-on-surface-variant">
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

          {/* Neural Core Analysis */}
          <div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center">
                <span className="text-on-tertiary-container text-lg">&#9673;</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-on-surface">Neural Core Analysis</h3>
                <span className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">AI-DRIVEN INSIGHTS</span>
              </div>
            </div>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Analysis based on current indicator state for {selectedSymbol.replace('_', '/')}.
              {(() => {
                const rsi = snapshot.data?.['H1']?.['rsi_14']
                if (rsi == null) return ' RSI data not available.'
                if (rsi > 70) return ` RSI at ${rsi.toFixed(1)} — overbought territory. Watch for potential reversal.`
                if (rsi < 30) return ` RSI at ${rsi.toFixed(1)} — oversold territory. Watch for potential bounce.`
                return ` RSI at ${rsi.toFixed(1)} — neutral range.`
              })()}
            </p>
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
