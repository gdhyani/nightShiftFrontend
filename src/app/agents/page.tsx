'use client'

import { useState, useMemo } from 'react'
import { Terminal, Cpu, Scale } from 'lucide-react'
import { useAgents, useAgentInsights } from '@/hooks/useAgentInsights'
import { AgentCard } from '@/components/agents/agent-card'

const SYMBOLS = ['EUR_USD', 'GBP_USD', 'USD_JPY']

const REASONING_LOG = [
  { tag: 'INIT', color: 'text-primary', message: 'Evaluating London AM Session profile...' },
  {
    type: 'block',
    lines: [
      { color: 'text-on-surface', text: '> DERIVING HYPOTHESIS FROM SKILL.md::Temporal_Bias' },
      { color: 'text-outline', text: 'IF (Time > 08:00 GMT) AND (Volatility > 1.2x Avg) THEN Search for Judas Swing' },
      { color: 'text-primary', text: 'SUCCESS: Current Volatility = 1.48x. Time = 09:12 GMT.' },
    ],
  },
  { tag: 'INFO', color: 'text-secondary-container', message: 'Price breached Asia High at 1.0842. Analyzing follow-through...' },
  {
    type: 'block',
    lines: [
      { color: 'text-on-surface', text: '> CROSS_REF::Correlation_Agent' },
      { color: 'text-outline', text: 'DXY displaying negative divergence. EURUSD breach likely expansionary.' },
    ],
  },
  {
    tag: 'REASONING',
    tagClass: 'bg-primary/20 text-primary px-1 mr-1',
    color: 'text-on-surface',
    message:
      '"The London open manipulation phase has concluded. The failed return to the Asia range indicates a \'Buy Day\' profile. Maintaining Long bias until NY Open confluence."',
  },
  { tag: 'SIGNAL', color: 'text-primary', message: 'CONFIRMED BULLISH BIAS (Confidence: High)', bold: true },
  { tag: 'WARN', color: 'text-amber-500', message: 'HTF liquidity pocket detected 12 pips above current price. Expected resistance zone approaching.' },
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

  const sentimentLabel =
    sentimentScore > 75
      ? 'STRONGLY BULLISH'
      : sentimentScore > 60
        ? 'BULLISH'
        : sentimentScore < 25
          ? 'STRONGLY BEARISH'
          : sentimentScore < 40
            ? 'BEARISH'
            : 'NEUTRAL'
  const sentimentColor =
    sentimentScore > 60 ? 'text-primary' : sentimentScore < 40 ? 'text-error' : 'text-on-surface'

  // Compute gauge segment widths from score
  const bearishWidth = Math.max(5, 100 - sentimentScore)
  const neutralWidth = 20
  const bullishWidth = Math.max(5, sentimentScore)
  const total = bearishWidth + neutralWidth + bullishWidth

  return (
    <div className="flex flex-col gap-8">
      {/* Header & Sentiment Gauge */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-8">
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-4xl lg:text-5xl font-headline font-bold text-on-surface tracking-tight uppercase">
              Agent Intelligence
            </h1>
            <select
              value={selectedSymbol}
              onChange={(e) => setSelectedSymbol(e.target.value)}
              className="bg-surface-container-highest rounded-lg px-3 py-2 text-on-surface border border-outline-variant/20 font-mono text-sm"
            >
              {SYMBOLS.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', '/')}
                </option>
              ))}
            </select>
          </div>
          <p className="text-on-surface-variant max-w-2xl font-light">
            Real-time cross-functional synthesis from the autonomous agent layer. Parallel evaluation
            active across 8 cognitive nodes.
          </p>
        </div>

        {/* Market Sentiment Gauge */}
        <div className="lg:col-span-4 glass-panel rounded-full p-6 flex flex-col items-center justify-center border border-outline-variant/10">
          <div className="w-full flex justify-between mb-2 px-2">
            <span className="text-[10px] font-mono text-on-surface-variant uppercase">
              Sentiment Engine
            </span>
            <span className="text-[10px] font-mono text-primary uppercase">
              Confidence {sentimentScore}%
            </span>
          </div>
          <div className="relative w-full h-4 bg-surface-container-lowest rounded-full overflow-hidden flex">
            <div
              className="h-full bg-error/40"
              style={{ width: `${(bearishWidth / total) * 100}%` }}
            />
            <div
              className="h-full bg-surface-container-highest"
              style={{ width: `${(neutralWidth / total) * 100}%` }}
            />
            <div
              className="h-full bg-primary shadow-[0_0_10px_rgba(0,255,65,0.5)]"
              style={{ width: `${(bullishWidth / total) * 100}%` }}
            />
          </div>
          <div className="w-full flex justify-between mt-2 text-[10px] font-mono">
            <span className="text-error">BEARISH</span>
            <span className="text-on-surface">NEUTRAL</span>
            <span className="text-primary">BULLISH</span>
          </div>
          <div className="mt-4 text-center">
            <span className={`text-2xl font-headline font-bold ${sentimentColor}`}>
              {sentimentLabel}
            </span>
          </div>
        </div>
      </section>

      {/* Agent Grid — single flat grid, all 8 cards */}
      {agents && (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {agents
            .slice()
            .sort((a, b) => a.tier - b.tier)
            .map((agent) => (
              <AgentCard
                key={agent.name}
                agent={agent}
                latestInsight={getLatestInsight(agent.name)}
              />
            ))}
        </section>
      )}

      {/* Detailed Reasoning Log & Agent Stats */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reasoning Log */}
        <div className="lg:col-span-2 bg-surface-container-lowest rounded-xl flex flex-col h-[500px] border border-outline-variant/10 overflow-hidden">
          <div className="p-4 bg-surface-container flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal size={20} className="text-primary" />
              <span className="font-headline font-bold uppercase tracking-widest text-sm">
                Agent Logic Stream
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-surface-container-lowest rounded px-2 py-1 border border-outline-variant/20">
                <span className="text-[10px] font-mono text-on-surface-variant mr-2 uppercase">
                  Log Level:
                </span>
                <select className="bg-transparent border-none text-[10px] font-mono text-primary focus:ring-0 py-0 pl-0 pr-6">
                  <option>INFO</option>
                  <option>DEBUG</option>
                  <option>WARN</option>
                  <option>ERROR</option>
                </select>
              </div>
              <span className="text-[10px] font-mono text-on-surface-variant hidden sm:block">
                LIVE TRANSMISSION
              </span>
            </div>
          </div>
          <div className="p-6 overflow-y-auto flex-1 font-mono text-xs leading-relaxed">
            {REASONING_LOG.map((entry, i) => {
              if ('type' in entry && entry.type === 'block') {
                return (
                  <div key={i} className="mb-4 pl-4 border-l border-outline-variant">
                    {entry.lines.map((line, j) => (
                      <div key={j} className={`${line.color} ${j > 0 ? 'mt-2' : 'mb-2'}`}>
                        {line.text}
                      </div>
                    ))}
                  </div>
                )
              }
              const e = entry as {
                tag: string
                color: string
                message: string
                tagClass?: string
                bold?: boolean
              }
              return (
                <div key={i} className="mb-4">
                  <span className={e.tagClass ?? e.color}>[{e.tag}]</span>{' '}
                  <span
                    className={`${e.bold ? 'font-bold ' : ''}${e.tag === 'WARN' ? 'text-on-surface-variant' : e.bold ? e.color : 'text-on-surface-variant'}`}
                  >
                    {e.message}
                  </span>
                </div>
              )
            })}
            <div className="flex items-center gap-2 text-on-surface-variant opacity-50">
              <span className="animate-pulse">_</span>
              <span>Parallel Evaluation Node 4: Listening for next tick...</span>
            </div>
          </div>
        </div>

        {/* Agent Stats & Orb */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Agent Orb */}
          <div className="bg-surface-container-lowest rounded-xl p-8 flex flex-col items-center justify-center text-center border border-outline-variant/10 flex-1 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent" />
            <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center mb-6 relative">
              <div className="absolute inset-0 rounded-full animate-ping bg-primary/5" />
              <div className="w-24 h-24 rounded-full bg-primary/20 border-4 border-primary/40 shadow-[0_0_40px_rgba(0,255,65,0.2)] flex items-center justify-center">
                <Cpu size={36} className="text-primary" />
              </div>
            </div>
            <h4 className="font-headline font-bold text-xl mb-1 uppercase tracking-tighter text-primary">
              Logic Core Active
            </h4>
            <p className="text-sm text-on-surface-variant mb-6">
              Processing 4.2M data points/sec
            </p>
            <div className="w-full space-y-4">
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-on-surface-variant">UPTIME</span>
                <span className="text-on-surface">14d 02h 45m</span>
              </div>
              <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-primary w-[98%]" />
              </div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-on-surface-variant">LATENCY</span>
                <span className="text-on-surface">14ms</span>
              </div>
              <div className="w-full h-1 bg-surface-container rounded-full overflow-hidden">
                <div className="h-full bg-secondary-container w-[12%]" />
              </div>
              <div className="flex justify-between text-[10px] font-mono">
                <span className="text-on-surface-variant">SYNC STATUS</span>
                <span className="text-primary">FULLY AUTONOMOUS</span>
              </div>
            </div>
          </div>

          {/* Governance Policy Card */}
          <div className="bg-surface-container-highest p-6 rounded-xl border border-outline-variant/20 flex flex-col justify-between items-start">
            <div className="flex items-center gap-2 mb-4">
              <Scale size={14} className="text-error" />
              <span className="text-[10px] font-bold text-on-surface uppercase">
                Governance Policy
              </span>
            </div>
            <h4 className="font-headline font-bold text-on-surface text-lg leading-tight mb-2">
              Automated Risk Shield Active
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Agent execution is managed by the Oracle Consensus Layer. Parallel evaluations must
              reach &gt;85% confidence for order entry.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-primary">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              MONITORING EXECUTION FLOW
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
