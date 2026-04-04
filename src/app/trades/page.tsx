import { TradeTable } from '@/components/trades/trade-table'
import { OrderForm } from '@/components/orders/order-form'

export default function TradesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Trades</h1>
        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Trade history with agent reasoning</p>
      </div>
      <OrderForm />
      <TradeTable />
    </div>
  )
}
