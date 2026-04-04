'use client'

import { useAtomValue } from 'jotai'
import Link from 'next/link'
import { useStoreSnapshot } from '@/hooks/useStoreSnapshot'
import { livePricesAtom } from '@/stores/app'
import { PriceCell } from './price-cell'

const SYMBOLS = ['NSE_EQ|INE848E01016', 'NSE_EQ|INE040A01034', 'NSE_EQ|INE467B01029']

function WatchlistRow({ symbol }: { symbol: string }) {
  const livePrices = useAtomValue(livePricesAtom)
  const { data: snapshot } = useStoreSnapshot(symbol)

  const liveCandle = livePrices[symbol]
  const price = liveCandle?.close ?? null
  const h1Data = snapshot?.data?.['H1'] ?? {}

  return (
    <Link
      href={`/chart/${symbol}`}
      className="grid grid-cols-5 gap-4 items-center px-4 py-3 rounded-2xl transition-colors"
      style={{ color: 'var(--text-primary)' }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--void-surface)'}
      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
    >
      <div className="font-medium">{symbol.includes('|') ? symbol.split('|').pop() : symbol.replace('_', '/')}</div>
      <div><PriceCell price={price} /></div>
      <div className="text-sm font-[family-name:var(--font-mono)]" style={{ color: 'var(--text-secondary)' }}>
        {h1Data.rsi_14 != null ? Number(h1Data.rsi_14).toFixed(1) : '—'}
      </div>
      <div className="text-sm font-[family-name:var(--font-mono)]" style={{ color: 'var(--text-secondary)' }}>
        {h1Data.sma_20 != null ? Number(h1Data.sma_20).toFixed(2) : '—'}
      </div>
      <div className="text-sm font-[family-name:var(--font-mono)]" style={{ color: 'var(--text-secondary)' }}>
        {h1Data.atr_14 != null ? Number(h1Data.atr_14).toFixed(2) : '—'}
      </div>
    </Link>
  )
}

export function WatchlistTable() {
  return (
    <div>
      <div className="grid grid-cols-5 gap-4 px-4 py-2 text-xs uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
        <div>Symbol</div>
        <div>Price</div>
        <div>RSI (14)</div>
        <div>SMA (20)</div>
        <div>ATR (14)</div>
      </div>
      <div className="space-y-1">
        {SYMBOLS.map((symbol) => (
          <WatchlistRow key={symbol} symbol={symbol} />
        ))}
      </div>
    </div>
  )
}
