'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useStrategies, useToggleStrategy } from '@/hooks/useStrategies'
import { CreateStrategyForm } from '@/components/strategies/create-strategy-form'
import type { Strategy } from '@/types/api'

/* ---------- tiny sparkline ---------- */
function Sparkline({ positive, inactive }: { positive: boolean; inactive: boolean }) {
  const points = inactive
    ? '0,24 20,22 40,20 60,21 80,20 100,19 120,20'
    : positive
      ? '0,28 20,24 40,26 60,18 80,14 100,10 120,6'
      : '0,6 20,10 40,8 60,16 80,20 100,24 120,28'

  const color = inactive ? '#888' : positive ? '#4ade80' : '#f87171'
  const gradientId = `spark-${positive ? 'g' : 'r'}-${inactive ? 'i' : 'a'}`

  return (
    <svg viewBox="0 0 120 32" className={`w-full h-16 ${inactive ? 'grayscale' : ''}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      <polygon points={`0,32 ${points} 120,32`} fill={`url(#${gradientId})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/* ---------- asset filter pills ---------- */
const ASSETS = ['All Assets', 'Forex', 'Crypto'] as const

function filterStrategies(strategies: Strategy[], filter: string) {
  if (filter === 'All Assets') return strategies
  if (filter === 'Forex') return strategies.filter(s => /EUR|GBP|USD|JPY|AUD|NZD|CHF|CAD/.test(s.symbols))
  if (filter === 'Crypto') return strategies.filter(s => /BTC|ETH|SOL|DOGE|XRP/.test(s.symbols))
  return strategies
}

/* ---------- strategy card ---------- */
function StrategyCard({ strategy, index }: { strategy: Strategy; index: number }) {
  const toggle = useToggleStrategy()
  const active = strategy.enabled
  const symbolCount = strategy.symbols.split(',').length
  const agentStages = (strategy.pipeline_config?.stages as Array<Record<string, string>>) ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className={`bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 hover:bg-surface-container-low transition-all ${
        !active ? 'opacity-60' : ''
      }`}
    >
      {/* header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 bg-surface-container-high rounded-xl flex items-center justify-center text-lg shrink-0">
          ⬡
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-headline font-bold text-lg text-on-surface truncate">{strategy.name}</h3>
            <span className={`w-2 h-2 rounded-full shrink-0 ${active ? 'bg-green-400 animate-pulse' : 'bg-on-surface-variant/40'}`} />
          </div>
          <p className="text-xs font-mono text-on-surface-variant/60 truncate">{strategy.symbols.replace(/,/g, ' · ')}</p>
        </div>
        {/* toggle switch */}
        <button
          onClick={() => toggle.mutate({ id: strategy.id, enabled: !active })}
          className={`w-11 h-6 rounded-full transition-all duration-300 relative shrink-0 ${
            active ? 'bg-primary-container' : 'bg-surface-container-highest'
          }`}
        >
          <motion.div
            animate={{ x: active ? 22 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-1 w-4 h-4 rounded-full bg-white"
          />
        </button>
      </div>

      {/* stats 2x2 */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="bg-surface-container-high/30 p-3 rounded-lg">
          <div className="text-[10px] uppercase tracking-wider text-on-surface-variant/50 mb-1">Growth</div>
          <div className={`font-headline text-xl ${active ? 'text-green-400' : 'text-on-surface-variant/50'}`}>
            {active ? '+2.4%' : '--'}
          </div>
        </div>
        <div className="bg-surface-container-high/30 p-3 rounded-lg">
          <div className="text-[10px] uppercase tracking-wider text-on-surface-variant/50 mb-1">Trades</div>
          <div className="font-mono text-xl text-on-surface">{active ? '12' : '0'}</div>
        </div>
        <div className="bg-surface-container-high/30 p-3 rounded-lg">
          <div className="text-[10px] uppercase tracking-wider text-on-surface-variant/50 mb-1">Interval</div>
          <div className="font-mono text-sm text-on-surface-variant">{strategy.schedule_interval}s</div>
        </div>
        <div className="bg-surface-container-high/30 p-3 rounded-lg">
          <div className="text-[10px] uppercase tracking-wider text-on-surface-variant/50 mb-1">Agents</div>
          <div className="font-mono text-sm text-on-surface-variant">{agentStages.length}</div>
        </div>
      </div>

      {/* sparkline */}
      <Sparkline positive={active} inactive={!active} />

      {/* footer */}
      <div className="flex items-center justify-between mt-4">
        {/* agent avatars */}
        <div className="flex -space-x-2">
          {agentStages.slice(0, 4).map((stage, i) => (
            <div
              key={i}
              className="w-7 h-7 rounded-full bg-surface-container-highest border-2 border-surface-container-lowest flex items-center justify-center text-[9px] font-bold text-on-surface-variant uppercase"
              title={stage.name}
            >
              {stage.name?.charAt(0) ?? '?'}
            </div>
          ))}
          {agentStages.length > 4 && (
            <div className="w-7 h-7 rounded-full bg-surface-container-highest border-2 border-surface-container-lowest flex items-center justify-center text-[9px] text-on-surface-variant">
              +{agentStages.length - 4}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/strategies/${strategy.id}`}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-primary-container/60 text-on-primary hover:bg-primary-container transition-colors"
          >
            View Details
          </Link>
          <Link
            href={`/strategies/${strategy.id}/flow`}
            className="px-3 py-1.5 rounded-lg text-xs text-secondary bg-surface-container-high hover:bg-surface-container-highest transition-colors"
          >
            Flow
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

/* ---------- deploy card ---------- */
function DeployCard({ onClick }: { onClick: () => void }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.35 }}
      onClick={onClick}
      className="group border-2 border-dashed border-outline-variant/30 rounded-xl p-6 flex flex-col items-center justify-center gap-4 min-h-[320px] hover:border-primary/40 transition-all"
    >
      <div className="w-16 h-16 rounded-2xl bg-surface-container-high flex items-center justify-center text-3xl text-on-surface-variant/40 group-hover:text-green-400 group-hover:shadow-[0_0_24px_rgba(74,222,128,0.25)] transition-all duration-300">
        +
      </div>
      <div>
        <div className="font-headline font-bold text-on-surface-variant/60 group-hover:text-on-surface transition-colors">Deploy New Strategy</div>
        <div className="text-xs text-on-surface-variant/40 mt-1">Configure and launch an AI strategy</div>
      </div>
    </motion.button>
  )
}

/* ---------- oracle insight ---------- */
function OracleInsight() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-xl p-8 flex items-start gap-5"
    >
      <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center text-2xl shrink-0">
        ◈
      </div>
      <div>
        <h3 className="font-headline font-bold text-on-surface mb-1">Oracle Optimization</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed">
          Based on recent market conditions, strategies targeting Forex pairs with 30-minute intervals are showing the
          strongest risk-adjusted returns. Consider increasing allocation to EUR/USD and GBP/USD sessions during London open.
        </p>
        <div className="mt-3 flex gap-2">
          <span className="px-2.5 py-1 text-[10px] font-mono uppercase rounded-lg bg-purple-500/15 text-purple-300">Recommendation</span>
          <span className="px-2.5 py-1 text-[10px] font-mono uppercase rounded-lg bg-surface-container-high text-on-surface-variant/60">
            Confidence 0.82
          </span>
        </div>
      </div>
    </motion.div>
  )
}

/* ---------- page ---------- */
export default function StrategiesPage() {
  const { data: strategies, isLoading } = useStrategies()
  const [filter, setFilter] = useState<string>('All Assets')
  const [showCreate, setShowCreate] = useState(false)

  const filtered = strategies ? filterStrategies(strategies, filter) : []

  return (
    <div className="space-y-8">
      {/* header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-4xl font-bold tracking-tighter text-on-surface">Strategy Library</h1>
          <p className="text-sm mt-1 text-on-surface-variant">Deploy and manage AI trading strategies</p>
        </div>
        <div className="flex gap-2">
          {ASSETS.map(a => (
            <button
              key={a}
              onClick={() => setFilter(a)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                filter === a
                  ? 'bg-primary-container text-on-primary'
                  : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      {/* loading */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-80 rounded-xl animate-pulse bg-surface-container-lowest" />
          ))}
        </div>
      )}

      {/* bento grid */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s, i) => (
            <StrategyCard key={s.id} strategy={s} index={i} />
          ))}
          <DeployCard onClick={() => setShowCreate(true)} />
        </div>
      )}

      {/* create modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowCreate(false) }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg mx-4"
            >
              <CreateStrategyForm onClose={() => setShowCreate(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* oracle insight */}
      <OracleInsight />
    </div>
  )
}
