import { WatchlistTable } from '@/components/markets/watchlist-table'

export default function MarketsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Markets</h1>
        <p className="text-zinc-500 mt-1">Live watchlist with prices and indicators</p>
      </div>
      <WatchlistTable />
    </div>
  )
}
