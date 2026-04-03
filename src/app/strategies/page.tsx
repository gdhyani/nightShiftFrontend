import { CreateStrategyForm } from '@/components/strategies/create-strategy-form'
import { StrategyTable } from '@/components/strategies/strategy-table'

export default function StrategiesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Strategies</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>Manage AI trading strategies</p>
        </div>
        <CreateStrategyForm />
      </div>
      <StrategyTable />
    </div>
  )
}
