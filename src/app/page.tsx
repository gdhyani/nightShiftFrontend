'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

import { EquityCurve } from '@/components/analytics/equity-curve'
import { useAgentInsights } from '@/hooks/useAgentInsights'
import { useStrategies } from '@/hooks/useStrategies'
import { useTrades } from '@/hooks/useTrades'

const STATUS_BADGES = [
  { label: 'OANDA', value: 'CONNECTED' },
  { label: 'MT5', value: 'ACTIVE' },
  { label: 'LLM', value: 'RUNNING' },
  { label: 'LATENCY', value: '12ms' },
]

const WATCHLIST_ITEMS = [
  { symbol: 'EUR/USD', icon: '€', color: 'bg-secondary', price: '1.08432', change: '+0.12%', positive: true, volatility: 'Low', trend: [40, 42, 38, 44, 46, 43, 47] },
  { symbol: 'XAU/USD', icon: 'Au', color: 'bg-tertiary-container', price: '2,312.50', change: '-0.34%', positive: false, volatility: 'High', trend: [60, 58, 55, 52, 54, 50, 48] },
  { symbol: 'GBP/USD', icon: '£', color: 'bg-primary-container', price: '1.26318', change: '+0.08%', positive: true, volatility: 'Med', trend: [30, 32, 34, 33, 36, 38, 37] },
  { symbol: 'USD/JPY', icon: '¥', color: 'bg-error', price: '151.842', change: '-0.21%', positive: false, volatility: 'Med', trend: [50, 48, 46, 49, 45, 43, 44] },
]

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

function MiniSparkline({ data, positive }: { data: number[]; positive: boolean }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1
  const h = 24
  const w = 60
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ')
  return (
    <svg width={w} height={h} className="inline-block">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? '#00ff41' : '#ffb4ab'}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function DashboardPage() {
  const { data: strategies } = useStrategies()
  const { data: trades } = useTrades()
  const { data: insights } = useAgentInsights()

  const activeStrategies = strategies?.filter((s) => s.enabled) ?? []
  const openTrades = trades?.filter((t) => t.status === 'open') ?? []
  const recentTrades = trades?.slice(0, 5) ?? []
  const recentInsights = insights?.slice(0, 4) ?? []

  return (
    <div className="space-y-6">
      {/* ── Status Badges Bar ── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-3 flex-wrap"
      >
        {STATUS_BADGES.map((b) => (
          <div
            key={b.label}
            className="flex items-center gap-2 bg-surface-container-lowest px-3 py-1.5 rounded-full border border-outline-variant/10"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-primary-container shadow-[0_0_8px_#00ff41]" />
            <span className="text-[10px] font-mono text-on-surface-variant">
              {b.label}: {b.value}
            </span>
          </div>
        ))}
        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10">
          <span className="text-xs font-mono text-primary">
            {activeStrategies.length} strategies active
          </span>
        </div>
      </motion.div>

      {/* ── 12-Column Grid ── */}
      <div className="grid grid-cols-12 gap-6">
        {/* ── Equity Growth Card (col-span-8) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="col-span-12 lg:col-span-8 glass-card rounded-xl p-6 border border-outline-variant/5 relative overflow-hidden"
        >
          {/* Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-[9rem] leading-none font-black font-headline text-primary opacity-[0.04]">
              KINETIC
            </span>
          </div>

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
                  Equity Growth
                </h2>
                <div className="mt-2 text-4xl font-headline font-bold text-primary tabular-nums">
                  $142,850.21
                </div>
                <div className="mt-1 text-primary-container text-xs font-mono font-bold">
                  +12.4% THIS MONTH
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-right">
                <div>
                  <div className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">Daily ROI</div>
                  <div className="text-sm font-mono font-bold text-secondary tabular-nums">+1.82%</div>
                </div>
                <div>
                  <div className="text-[10px] font-mono text-on-surface-variant uppercase tracking-widest">Max DD</div>
                  <div className="text-sm font-mono font-bold text-error tabular-nums">-4.12%</div>
                </div>
              </div>
            </div>

            <div className="h-[200px]">
              <EquityCurve />
            </div>
          </div>
        </motion.div>

        {/* ── AI Insights Panel (col-span-4) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-12 lg:col-span-4 bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10 flex flex-col"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-tertiary-container/30 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-on-tertiary-container" />
              </div>
              <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
                AI Insights
              </h2>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-container" />
              </span>
              <span className="text-[10px] font-mono text-primary-container uppercase tracking-widest">Live Stream</span>
            </div>
          </div>

          <div className="space-y-2 flex-1 overflow-y-auto">
            {recentInsights.length > 0 ? (
              recentInsights.map((insight, i) => (
                <div
                  key={insight.id}
                  className={`p-3 rounded-lg border-l-2 ${
                    i === 0
                      ? 'bg-surface-container border-on-tertiary-container'
                      : 'bg-surface-container-low border-outline-variant'
                  }`}
                >
                  <div className="text-[10px] font-mono text-on-surface-variant uppercase">
                    {insight.agent_name.includes('tier') ? '' : 'T1 · '}{insight.agent_name.replace(/_/g, ' ')}
                  </div>
                  <div className="text-xs text-on-surface mt-1 line-clamp-2">
                    {insight.insight_type}: {String(insight.data?.summary || insight.data?.message || insight.insight_type)}
                  </div>
                  <div className="text-[10px] font-mono text-on-surface-variant mt-1">
                    {timeAgo(insight.created_at)}
                  </div>
                </div>
              ))
            ) : (
              <>
                <div className="p-3 bg-surface-container rounded-lg border-l-2 border-on-tertiary-container">
                  <div className="text-[10px] font-mono text-on-surface-variant">T2 · BIAS AGENT</div>
                  <div className="text-xs text-on-surface mt-1">EUR/USD showing bullish divergence on H4 RSI — bias shifts long above 1.0850</div>
                  <div className="text-[10px] font-mono text-on-surface-variant mt-1">2m ago</div>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg border-l-2 border-outline-variant">
                  <div className="text-[10px] font-mono text-on-surface-variant">T1 · SESSION AGENT</div>
                  <div className="text-xs text-on-surface mt-1">London open: high-impact news in 45min — widening spreads expected</div>
                  <div className="text-[10px] font-mono text-on-surface-variant mt-1">8m ago</div>
                </div>
                <div className="p-3 bg-surface-container-low rounded-lg border-l-2 border-outline-variant">
                  <div className="text-[10px] font-mono text-on-surface-variant">T2 · STRUCTURE AGENT</div>
                  <div className="text-xs text-on-surface mt-1">XAU/USD broke daily resistance at 2310 — watching for retest</div>
                  <div className="text-[10px] font-mono text-on-surface-variant mt-1">14m ago</div>
                </div>
              </>
            )}
          </div>

          <Link
            href="/agents"
            className="mt-4 text-xs font-mono text-secondary hover:text-secondary-container transition-colors text-center"
          >
            View Full Decision Tree &rarr;
          </Link>
        </motion.div>

        {/* ── Watchlist (col-span-7) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-12 lg:col-span-7 glass-card rounded-xl p-6 border border-outline-variant/5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
              Watchlist
            </h2>
            <div className="flex items-center gap-1">
              {['1H', '4H', '1D'].map((tf, i) => (
                <button
                  key={tf}
                  className={`px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-widest transition-colors ${
                    i === 0
                      ? 'bg-primary/15 text-primary'
                      : 'text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-mono uppercase tracking-widest text-on-surface-variant border-b border-outline-variant/10">
                <th className="text-left pb-2 font-normal">Symbol</th>
                <th className="text-right pb-2 font-normal">Price</th>
                <th className="text-right pb-2 font-normal">Change</th>
                <th className="text-right pb-2 font-normal">Volatility</th>
                <th className="text-right pb-2 font-normal">Trend</th>
              </tr>
            </thead>
            <tbody>
              {WATCHLIST_ITEMS.map((item) => (
                <tr key={item.symbol} className="border-b border-outline-variant/5 hover:bg-surface-container/30 transition-colors">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full ${item.color} flex items-center justify-center text-[10px] font-bold text-on-primary`}>
                        {item.icon}
                      </div>
                      <span className="text-sm font-medium text-on-surface">{item.symbol}</span>
                    </div>
                  </td>
                  <td className="text-right text-sm font-mono tabular-nums text-on-surface">{item.price}</td>
                  <td className={`text-right text-sm font-mono tabular-nums ${item.positive ? 'text-primary-container' : 'text-error'}`}>
                    {item.change}
                  </td>
                  <td className="text-right text-xs font-mono text-on-surface-variant">{item.volatility}</td>
                  <td className="text-right">
                    <MiniSparkline data={item.trend} positive={item.positive} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>

        {/* ── Active Trades (col-span-5) ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="col-span-12 lg:col-span-5 bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/10"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest">
              Active Trades
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary tabular-nums">
              {openTrades.length} OPEN
            </span>
          </div>

          <div className="space-y-3">
            {recentTrades.length > 0 ? (
              recentTrades.map((t) => {
                const pnl = t.pnl ?? 0
                const isProfit = pnl >= 0
                return (
                  <Link
                    key={t.id}
                    href={`/trades/${t.id}`}
                    className="block p-4 bg-surface-container rounded-lg border border-outline-variant/5 hover:bg-surface-container-high transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-on-surface">
                          {t.symbol.replace('_', '/')}
                        </span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            t.direction === 'BUY'
                              ? 'bg-primary/10 text-primary'
                              : 'bg-error/10 text-error'
                          }`}
                        >
                          {t.direction}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-mono font-bold tabular-nums ${
                          isProfit ? 'text-primary-container' : 'text-error'
                        }`}
                      >
                        {pnl >= 0 ? '+' : ''}{pnl.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-on-surface-variant">
                      <span>{t.quantity ?? '0.01'} lots @ {t.entry_price?.toFixed(5) ?? '—'}</span>
                      <span className="tabular-nums">{t.status}</span>
                    </div>
                    {/* Progress bar */}
                    <div className="mt-2 h-1 rounded-full bg-surface-container-high overflow-hidden">
                      <div
                        className={`h-1 rounded-full ${
                          isProfit
                            ? 'bg-primary-container shadow-[0_0_6px_#00ff41]'
                            : 'bg-error shadow-[0_0_6px_#ffb4ab]'
                        }`}
                        style={{ width: `${Math.min(Math.abs(pnl) * 10, 100)}%` }}
                      />
                    </div>
                  </Link>
                )
              })
            ) : (
              <>
                {/* Placeholder trades */}
                {[
                  { sym: 'EUR/USD', dir: 'BUY', lots: '0.10', entry: '1.08312', pnl: '+24.50', pips: '+24.5', pct: 65 },
                  { sym: 'XAU/USD', dir: 'SELL', lots: '0.05', entry: '2308.40', pnl: '-8.20', pips: '-8.2', pct: 20 },
                  { sym: 'GBP/USD', dir: 'BUY', lots: '0.08', entry: '1.26180', pnl: '+12.80', pips: '+12.8', pct: 40 },
                ].map((t) => (
                  <div
                    key={t.sym}
                    className="p-4 bg-surface-container rounded-lg border border-outline-variant/5"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-on-surface">{t.sym}</span>
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                            t.dir === 'BUY' ? 'bg-primary/10 text-primary' : 'bg-error/10 text-error'
                          }`}
                        >
                          {t.dir}
                        </span>
                      </div>
                      <span
                        className={`text-sm font-mono font-bold tabular-nums ${
                          t.pnl.startsWith('+') ? 'text-primary-container' : 'text-error'
                        }`}
                      >
                        {t.pnl}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-on-surface-variant">
                      <span>{t.lots} lots @ {t.entry}</span>
                      <span className="tabular-nums">{t.pips} pips</span>
                    </div>
                    <div className="mt-2 h-1 rounded-full bg-surface-container-high overflow-hidden">
                      <div
                        className={`h-1 rounded-full ${
                          t.pnl.startsWith('+')
                            ? 'bg-primary-container shadow-[0_0_6px_#00ff41]'
                            : 'bg-error shadow-[0_0_6px_#ffb4ab]'
                        }`}
                        style={{ width: `${t.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          <Link
            href="/trades"
            className="mt-4 block text-xs font-mono text-secondary hover:text-secondary-container transition-colors text-center"
          >
            View All Trades &rarr;
          </Link>
        </motion.div>
      </div>
    </div>
  )
}
