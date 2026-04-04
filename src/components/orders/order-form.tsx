'use client'

import { useState } from 'react'
import { useAtomValue } from 'jotai'
import { motion, AnimatePresence } from 'framer-motion'
import { activeSymbolAtom } from '@/stores/app'
import { usePlaceOrder } from '@/hooks/useOrders'
import { useCalculateCharges } from '@/hooks/useCharges'
import type { ChargeBreakdown } from '@/types/api'

export function OrderForm() {
  const symbol = useAtomValue(activeSymbolAtom)
  const [isOpen, setIsOpen] = useState(false)
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY')
  const [qty, setQty] = useState(1)
  const [orderType, setOrderType] = useState<'MARKET' | 'LIMIT'>('MARKET')
  const [price, setPrice] = useState(0)
  const [charges, setCharges] = useState<ChargeBreakdown | null>(null)
  const [result, setResult] = useState<string | null>(null)

  const placeMutation = usePlaceOrder()
  const chargesMutation = useCalculateCharges()

  const handleCalculateCharges = () => {
    if (price > 0 && qty > 0) {
      chargesMutation.mutate({ symbol, side, qty, price }, {
        onSuccess: (data) => setCharges(data),
      })
    }
  }

  const handleSubmit = () => {
    placeMutation.mutate({ symbol, side, qty, order_type: orderType, price, product: 'D' }, {
      onSuccess: (data) => {
        setResult(`Order ${data.status}: ${data.side} ${data.qty}x @ ${data.fill_price}`)
        setCharges(null)
      },
    })
  }

  return (
    <div>
      <button onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 rounded-xl text-sm font-medium transition-all bg-primary-container text-on-primary hover:brightness-110">
        + New Order
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }} className="overflow-hidden">
            <div className="rounded-2xl p-5 space-y-4 bg-surface-container-low border border-outline-variant/20">
              <div className="text-xs font-mono text-on-surface-variant">{symbol}</div>

              <div className="flex gap-2">
                {(['BUY', 'SELL'] as const).map((s) => (
                  <button key={s} onClick={() => setSide(s)}
                    className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all border ${
                      side === s
                        ? s === 'BUY'
                          ? 'bg-primary/20 text-primary border-primary-container/40'
                          : 'bg-error/10 text-error border-error/40'
                        : 'bg-surface-container-high text-on-surface-variant border-outline-variant/20'
                    }`}>
                    {s}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs block mb-1 text-on-surface-variant">Quantity</label>
                  <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} min={1}
                    className="w-full bg-surface-container-highest rounded-lg px-4 py-3 text-sm font-mono text-on-surface border border-outline-variant/20 focus:border-primary-container/40 outline-none" />
                </div>
                <div>
                  <label className="text-xs block mb-1 text-on-surface-variant">Type</label>
                  <select value={orderType} onChange={(e) => setOrderType(e.target.value as 'MARKET' | 'LIMIT')}
                    className="w-full bg-surface-container-highest rounded-lg px-4 py-3 text-sm text-on-surface border border-outline-variant/20 focus:border-primary-container/40 outline-none">
                    <option value="MARKET">Market</option>
                    <option value="LIMIT">Limit</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs block mb-1 text-on-surface-variant">Price</label>
                  <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} step={0.05}
                    className="w-full bg-surface-container-highest rounded-lg px-4 py-3 text-sm font-mono text-on-surface border border-outline-variant/20 focus:border-primary-container/40 outline-none" />
                </div>
              </div>

              {charges && (
                <div className="bg-surface-container-lowest rounded-xl p-4 font-mono">
                  <div className="text-xs mb-2 text-on-surface-variant">Estimated Charges</div>
                  <div className="grid grid-cols-4 gap-2 text-xs">
                    <div><span className="text-on-surface-variant">Brokerage:</span> <span className="text-on-surface">{charges.brokerage}</span></div>
                    <div><span className="text-on-surface-variant">STT:</span> <span className="text-on-surface">{charges.stt}</span></div>
                    <div><span className="text-on-surface-variant">GST:</span> <span className="text-on-surface">{charges.gst}</span></div>
                    <div><span className="text-secondary">Total: {charges.total_charges}</span></div>
                  </div>
                </div>
              )}

              {result && (
                <div className="text-xs rounded-xl p-3 bg-primary/10 text-primary-container">
                  {result}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={handleCalculateCharges}
                  className="px-4 py-2 rounded-xl text-sm transition-all bg-surface-container-high text-on-surface-variant border border-outline-variant/20 hover:bg-surface-container-highest">
                  Calculate Charges
                </button>
                <button onClick={handleSubmit} disabled={placeMutation.isPending}
                  className={`px-5 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40 ${
                    side === 'BUY'
                      ? 'bg-primary-container text-on-primary'
                      : 'bg-error text-on-error'
                  }`}>
                  {placeMutation.isPending ? 'Placing...' : `Place ${side} Order`}
                </button>
                <button onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-xl text-sm text-on-surface-variant bg-surface-container-high hover:bg-surface-container-highest">
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
