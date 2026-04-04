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
          <h1 className="font-headline font-bold text-3xl uppercase tracking-tight text-on-surface">{symbol.replace('_', '/')}</h1>
          <p className="text-sm text-on-surface-variant">
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
            <div key={name} className="bg-surface-container-lowest rounded-xl p-3 border border-outline-variant/10">
              <div className="text-[11px] uppercase tracking-wider text-on-surface-variant">{name.replace(/_/g, ' ')}</div>
              <div className="text-sm font-mono tabular-nums mt-1 text-on-surface">
                {value != null ? Number(value).toFixed(5) : '—'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
