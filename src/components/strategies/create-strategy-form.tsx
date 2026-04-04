'use client'

import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'
import type { Strategy } from '@/types/api'

interface Props {
  onClose?: () => void
}

export function CreateStrategyForm({ onClose }: Props) {
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
      setName('')
      setSymbols('EUR_USD')
      setInterval(1800)
      onClose?.()
    },
  })

  return (
    <div className="rounded-xl p-6 space-y-5 bg-surface-container-lowest border border-outline-variant/10">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-headline font-bold text-xl text-on-surface">Deploy New Strategy</h2>
        {onClose && (
          <button onClick={onClose} className="text-on-surface-variant/60 hover:text-on-surface transition-colors text-lg">
            ✕
          </button>
        )}
      </div>

      <div>
        <label className="text-[11px] uppercase tracking-wider block mb-1.5 text-on-surface-variant">Strategy Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. SMC Swing Trade"
          className="w-full bg-surface-container-highest rounded-lg px-4 py-3 text-sm text-on-surface border border-outline-variant/20 outline-none transition-all duration-200 focus:border-primary-container/40 placeholder:text-on-surface-variant/40"
        />
      </div>

      <div>
        <label className="text-[11px] uppercase tracking-wider block mb-1.5 text-on-surface-variant">Symbols (comma-separated)</label>
        <input
          type="text"
          value={symbols}
          onChange={(e) => setSymbols(e.target.value)}
          placeholder="EUR_USD,GBP_USD"
          className="w-full bg-surface-container-highest rounded-lg px-4 py-3 text-sm font-mono text-on-surface border border-outline-variant/20 outline-none transition-all duration-200 focus:border-primary-container/40 placeholder:text-on-surface-variant/40"
        />
      </div>

      <div>
        <label className="text-[11px] uppercase tracking-wider block mb-1.5 text-on-surface-variant">Run Interval (seconds)</label>
        <select
          value={interval}
          onChange={(e) => setInterval(Number(e.target.value))}
          className="w-full bg-surface-container-highest rounded-lg px-4 py-3 text-sm text-on-surface border border-outline-variant/20 outline-none"
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
          className="px-5 py-2.5 rounded-lg text-sm font-bold bg-primary-container text-on-primary transition-all duration-200 disabled:opacity-40 hover:brightness-110"
        >
          {createMutation.isPending ? 'Deploying...' : 'Deploy Strategy'}
        </button>
        {onClose && (
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm text-on-surface-variant bg-surface-container-high transition-colors hover:bg-surface-container-highest"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  )
}
