'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { Strategy } from '@/types/api'

export function CreateStrategyForm() {
  const [isOpen, setIsOpen] = useState(false)
  const [name, setName] = useState('')
  const [symbols, setSymbols] = useState('EUR_USD')
  const [interval, setInterval] = useState(1800)
  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: (data: { name: string; symbols: string; schedule_interval: number }) =>
      apiFetch<Strategy>('/api/strategies', {
        method: 'POST',
        body: JSON.stringify({
          ...data,
          pipeline_config: { stages: [{ name: 'analyst', type: 'analyst' }, { name: 'evaluator', type: 'evaluator' }] },
        }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['strategies'] })
      setIsOpen(false)
      setName('')
      setSymbols('EUR_USD')
      setInterval(1800)
    },
  })

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
        style={{
          background: 'linear-gradient(135deg, var(--accent-emerald), var(--accent-cyan))',
          boxShadow: '0 0 20px var(--accent-emerald-glow)',
        }}
      >
        + New Strategy
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="rounded-2xl p-5 space-y-4" style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border)' }}>
              <div>
                <label className="text-xs block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Strategy Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. SMC Swing Trade"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all duration-200 focus:ring-1"
                  style={{
                    background: 'var(--void-elevated)',
                    border: '1px solid var(--void-border)',
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--accent-cyan)',
                  } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="text-xs block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Symbols (comma-separated)</label>
                <input
                  type="text"
                  value={symbols}
                  onChange={(e) => setSymbols(e.target.value)}
                  placeholder="EUR_USD,GBP_USD"
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none font-[family-name:var(--font-mono)] transition-all duration-200 focus:ring-1"
                  style={{
                    background: 'var(--void-elevated)',
                    border: '1px solid var(--void-border)',
                    color: 'var(--text-primary)',
                    '--tw-ring-color': 'var(--accent-cyan)',
                  } as React.CSSProperties}
                />
              </div>

              <div>
                <label className="text-xs block mb-1.5" style={{ color: 'var(--text-secondary)' }}>Run Interval (seconds)</label>
                <select
                  value={interval}
                  onChange={(e) => setInterval(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
                  style={{
                    background: 'var(--void-elevated)',
                    border: '1px solid var(--void-border)',
                    color: 'var(--text-primary)',
                  }}
                >
                  <option value={60}>Every 1 minute</option>
                  <option value={300}>Every 5 minutes</option>
                  <option value={900}>Every 15 minutes</option>
                  <option value={1800}>Every 30 minutes</option>
                  <option value={3600}>Every 1 hour</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => createMutation.mutate({ name, symbols, schedule_interval: interval })}
                  disabled={!name.trim() || createMutation.isPending}
                  className="px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 disabled:opacity-40"
                  style={{
                    background: 'var(--accent-emerald)',
                    boxShadow: '0 0 12px var(--accent-emerald-glow)',
                  }}
                >
                  {createMutation.isPending ? 'Creating...' : 'Create Strategy'}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm transition-colors"
                  style={{ color: 'var(--text-secondary)', background: 'var(--void-elevated)' }}
                >
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
