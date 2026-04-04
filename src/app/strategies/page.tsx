import { CreateStrategyForm } from '@/components/strategies/create-strategy-form'
import { StrategyTable } from '@/components/strategies/strategy-table'

export default function StrategiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-headline font-bold text-3xl uppercase tracking-tight text-on-surface">Strategies</h1>
          <p className="text-sm mt-1 text-on-surface-variant">Manage AI trading strategies</p>
        </div>
        <CreateStrategyForm />
      </div>
      <StrategyTable />
    </div>
  )
}
