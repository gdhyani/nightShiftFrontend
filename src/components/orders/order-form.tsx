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
      <button onClick={() => setIsOpen(!isOpen)} className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
        style={{ background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-cyan))', boxShadow: '0 0 20px rgba(16,185,129,0.15)' }}>
        + New Order
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }} className="overflow-hidden">
            <div className="rounded-2xl p-5 space-y-4" style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border)' }}>
              <div className="text-xs font-[family-name:var(--font-mono)]" style={{ color: 'var(--text-muted)' }}>{symbol}</div>

              <div className="flex gap-2">
                {(['BUY', 'SELL'] as const).map((s) => (
                  <button key={s} onClick={() => setSide(s)}
                    className="flex-1 py-2 rounded-xl text-sm font-medium transition-all"
                    style={{
                      background: side === s ? (s === 'BUY' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)') : 'var(--void-elevated)',
                      color: side === s ? (s === 'BUY' ? 'var(--accent-emerald)' : 'var(--accent-rose)') : 'var(--text-secondary)',
                      border: `1px solid ${side === s ? (s === 'BUY' ? 'var(--accent-emerald)' : 'var(--accent-rose)') : 'var(--void-border)'}`,
                    }}>
                    {s}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs block mb-1" style={{ color: 'var(--text-secondary)' }}>Quantity</label>
                  <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} min={1}
                    className="w-full px-3 py-2 rounded-xl text-sm font-[family-name:var(--font-mono)] outline-none"
                    style={{ background: 'var(--void-elevated)', border: '1px solid var(--void-border)', color: 'var(--text-primary)' }} />
                </div>
                <div>
                  <label className="text-xs block mb-1" style={{ color: 'var(--text-secondary)' }}>Type</label>
                  <select value={orderType} onChange={(e) => setOrderType(e.target.value as 'MARKET' | 'LIMIT')}
                    className="w-full px-3 py-2 rounded-xl text-sm outline-none"
                    style={{ background: 'var(--void-elevated)', border: '1px solid var(--void-border)', color: 'var(--text-primary)' }}>
                    <option value="MARKET">Market</option>
                    <option value="LIMIT">Limit</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs block mb-1" style={{ color: 'var(--text-secondary)' }}>Price</label>
                  <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} step={0.05}
                    className="w-full px-3 py-2 rounded-xl text-sm font-[family-name:var(--font-mono)] outline-none"
                    style={{ background: 'var(--void-elevated)', border: '1px solid var(--void-border)', color: 'var(--text-primary)' }} />
                </div>
              </div>

              {charges && (
                <div className="rounded-xl p-3" style={{ background: 'var(--void-elevated)', border: '1px solid var(--void-border)' }}>
                  <div className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>Estimated Charges</div>
                  <div className="grid grid-cols-4 gap-2 text-xs font-[family-name:var(--font-mono)]">
                    <div><span style={{ color: 'var(--text-muted)' }}>Brokerage:</span> <span style={{ color: 'var(--text-primary)' }}>{charges.brokerage}</span></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>STT:</span> <span style={{ color: 'var(--text-primary)' }}>{charges.stt}</span></div>
                    <div><span style={{ color: 'var(--text-muted)' }}>GST:</span> <span style={{ color: 'var(--text-primary)' }}>{charges.gst}</span></div>
                    <div><span style={{ color: 'var(--accent-amber)' }}>Total: {charges.total_charges}</span></div>
                  </div>
                </div>
              )}

              {result && (
                <div className="text-xs rounded-xl p-3" style={{ background: 'rgba(16,185,129,0.15)', color: 'var(--accent-emerald)' }}>
                  {result}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={handleCalculateCharges} className="px-4 py-2 rounded-xl text-sm transition-all"
                  style={{ background: 'var(--void-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--void-border)' }}>
                  Calculate Charges
                </button>
                <button onClick={handleSubmit} disabled={placeMutation.isPending}
                  className="px-5 py-2 rounded-xl text-sm font-medium transition-all disabled:opacity-40"
                  style={{ background: side === 'BUY' ? 'var(--accent-emerald)' : 'var(--accent-rose)', boxShadow: `0 0 12px ${side === 'BUY' ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)'}` }}>
                  {placeMutation.isPending ? 'Placing...' : `Place ${side} Order`}
                </button>
                <button onClick={() => setIsOpen(false)} className="px-4 py-2 rounded-xl text-sm"
                  style={{ color: 'var(--text-secondary)', background: 'var(--void-elevated)' }}>
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
