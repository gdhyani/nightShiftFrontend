'use client'

import { useAtom } from 'jotai'
import { CandlestickChart } from '@/components/charts/candlestick-chart'
import { TimeframeSelector } from '@/components/charts/timeframe-selector'
import { useStoreSnapshot } from '@/hooks/useStoreSnapshot'
import { activeTimeframeAtom } from '@/stores/app'

interface Props {
  symbol: string
}

export function ChartViewClient({ symbol }: Props) {
  const [timeframe] = useAtom(activeTimeframeAtom)
  const { data: snapshot } = useStoreSnapshot(symbol)

  const indicators = snapshot?.data?.[timeframe] ?? {}

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{symbol.replace('_', '/')}</h1>
          <p className="text-zinc-500 text-sm">
            {indicators.rsi_14 != null && `RSI: ${Number(indicators.rsi_14).toFixed(1)}`}
            {indicators.atr_14 != null && ` · ATR: ${Number(indicators.atr_14).toFixed(5)}`}
          </p>
        </div>
        <TimeframeSelector />
      </div>

      <CandlestickChart symbol={symbol} timeframe={timeframe} height={550} />

      {Object.keys(indicators).length > 0 && (
        <div className="grid grid-cols-4 gap-3">
          {Object.entries(indicators).map(([name, value]) => (
            <div key={name} className="bg-zinc-900 rounded-lg p-3">
              <div className="text-xs text-zinc-500 uppercase">{name.replace(/_/g, ' ')}</div>
              <div className="text-sm font-mono text-white mt-1">
                {value != null ? Number(value).toFixed(5) : '—'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
