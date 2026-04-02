import { StrategyTable } from '@/components/strategies/strategy-table'

export default function StrategiesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Strategies</h1>
        <p className="text-zinc-500 mt-1">Manage trading strategies and their execution</p>
      </div>
      <StrategyTable />
    </div>
  )
}
