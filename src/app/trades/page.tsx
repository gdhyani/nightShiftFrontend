import { TradeTable } from '@/components/trades/trade-table'

export default function TradesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Trades</h1>
        <p className="text-zinc-500 mt-1">Trade history with agent reasoning</p>
      </div>
      <TradeTable />
    </div>
  )
}
