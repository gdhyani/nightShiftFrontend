import { WatchlistTable } from '@/components/markets/watchlist-table'

export default function MarketsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline font-bold text-3xl uppercase tracking-tight text-on-surface">Markets</h1>
        <p className="text-on-surface-variant mt-1">Live watchlist with prices and indicators</p>
      </div>
      <WatchlistTable />
    </div>
  )
}
