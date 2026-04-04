'use client'

import { useState, useMemo } from 'react'
import { useAgents, useAgentInsights } from '@/hooks/useAgentInsights'
import { AgentCard } from '@/components/agents/agent-card'

const SYMBOLS = ['EUR_USD', 'GBP_USD', 'USD_JPY']

const REASONING_LOG = [
  { tag: 'INIT', color: 'text-tertiary-container', message: 'Agent pipeline initialized — 8 nodes online' },
  { tag: 'LOG', color: 'text-on-surface-variant', message: 'Polling OANDA for EUR/USD tick stream...' },
  { tag: 'SIGNAL', color: 'text-primary-container', message: 'Bullish bias detected — session overlap trigger' },
  { tag: 'LOG', color: 'text-on-surface-variant', message: 'Correlation matrix updated — GBP/USD divergence flagged' },
  { tag: 'SIGNAL', color: 'text-secondary-container', message: 'Liquidity sweep confirmed at 1.0842 low' },
]

export default function AgentInsightsPage() {
  const [selectedSymbol, setSelectedSymbol] = useState('EUR_USD')
  const { data: agents } = useAgents()
  const { data: insights } = useAgentInsights(selectedSymbol)

  const getLatestInsight = (agentName: string) => {
    return insights?.find((i) => i.agent_name === agentName) ?? null
  }

  const sentimentScore = useMemo(() => {
    if (!insights || insights.length === 0) return 50
    const confidences = insights
      .filter((i) => i.confidence != null)
      .map((i) => i.confidence! * 100)
    if (confidences.length === 0) return 50
    return Math.round(confidences.reduce((a, b) => a + b, 0) / confidences.length)
  }, [insights])

  const sentimentLabel = sentimentScore > 60 ? 'BULLISH' : sentimentScore < 40 ? 'BEARISH' : 'NEUTRAL'
  const sentimentColor = sentimentScore > 60 ? 'text-primary-container' : sentimentScore < 40 ? 'text-error' : 'text-secondary'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl lg:text-5xl font-headline font-bold uppercase tracking-tight text-on-surface">
            Agent Intelligence
          </h1>
          <p className="mt-2 text-on-surface-variant max-w-2xl font-light">
            Real-time multi-agent analysis pipeline. Tier 1 data agents feed Tier 2 analysis for autonomous signal generation.
          </p>
        </div>
        <select
          value={selectedSymbol}
          onChange={(e) => setSelectedSymbol(e.target.value)}
          className="bg-surface-container-highest rounded-lg px-3 py-2 text-on-surface border border-outline-variant/20 font-mono text-sm w-fit"
        >
          {SYMBOLS.map((s) => (
            <option key={s} value={s}>{s.replace('_', '/')}</option>
          ))}
        </select>
      </div>

      {/* Sentiment Gauge */}
      <div className="glass-panel rounded-xl p-6 border border-outline-variant/10">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-mono uppercase text-on-surface-variant tracking-widest">Aggregate Sentiment</span>
          <span className={`text-sm font-bold font-mono ${sentimentColor}`}>{sentimentLabel} ({sentimentScore}%)</span>
        </div>
        <div className="relative h-3 rounded-full overflow-hidden bg-surface-container-high">
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'linear-gradient(to right, #ffb4ab, #a2e7ff, #00ff41)',
            }}
          />
          <div
            className="absolute top-0 w-1 h-full bg-on-surface rounded-full transition-all duration-700"
            style={{ left: `${sentimentScore}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] font-mono text-error">BEARISH</span>
          <span className="text-[10px] font-mono text-secondary">NEUTRAL</span>
          <span className="text-[10px] font-mono text-primary-container">BULLISH</span>
        </div>
      </div>

      {/* Agent Grid */}
      {agents && (
        <>
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-primary mb-4">Tier 1 — Data Agents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {agents.filter((a) => a.tier === 1).map((agent) => (
                <AgentCard key={agent.name} agent={agent} latestInsight={getLatestInsight(agent.name)} />
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xs font-mono uppercase tracking-widest text-secondary mb-4">Tier 2 — Analysis Agents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {agents.filter((a) => a.tier === 2).map((agent) => (
                <AgentCard key={agent.name} agent={agent} latestInsight={getLatestInsight(agent.name)} />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Bottom Section: Reasoning Log + Orb + CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reasoning Log */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl p-5">
          <h3 className="text-xs font-mono uppercase tracking-widest text-on-surface-variant mb-4">Reasoning Log</h3>
          <div className="space-y-2 font-mono text-xs">
            {REASONING_LOG.map((entry, i) => (
              <div key={i} className="flex gap-3">
                <span className={`${entry.color} shrink-0`}>[{entry.tag}]</span>
                <span className="text-on-surface/80">{entry.message}</span>
              </div>
            ))}
            <div className="flex gap-3 animate-pulse">
              <span className="text-on-surface-variant">[...]</span>
              <span className="text-on-surface-variant">Awaiting next cycle...</span>
            </div>
          </div>
        </div>

        {/* Agent Orb + CTA */}
        <div className="flex flex-col items-center gap-6">
          {/* Orb */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-24 h-24 rounded-full bg-tertiary-container/20 animate-ping" />
            <div className="w-24 h-24 rounded-full bg-tertiary-container flex items-center justify-center shadow-[0_0_40px_rgba(236,212,255,0.4)]">
              <span className="text-on-tertiary-container font-headline font-bold text-xl">AI</span>
            </div>
          </div>

          {/* CTA Card */}
          <div className="bg-primary p-6 rounded-xl w-full text-center">
            <h3 className="font-headline font-extrabold text-on-primary text-sm uppercase tracking-wide">
              Synchronize All Agents for Auto-Trade
            </h3>
            <button className="mt-4 w-full bg-on-primary text-primary font-bold py-3 rounded-lg text-sm hover:opacity-90 transition-opacity">
              ACTIVATE SYNC
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
