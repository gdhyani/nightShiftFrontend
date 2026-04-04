# Kinetic Oracle Frontend Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the entire "VOID Terminal" visual theme with "The Kinetic Oracle" design system from Google Stitch, pixel-perfect across all 14 pages, while preserving all existing functionality.

**Architecture:** Layered swap — Phase 1 replaces design tokens (instant theme shift), Phase 2 rebuilds shared layout (sidebar + app shell), Phase 3 redesigns each page component-by-component, Phase 4 verifies with Chrome MCP screenshots. No changes to hooks, state, API client, or types.

**Tech Stack:** Next.js 16, Tailwind CSS v4 (CSS-first `@theme`), Lucide React icons, Framer Motion, Space Grotesk + Inter + JetBrains Mono fonts

**Design Contract:** `DESIGN.md` (project root) and `docs/superpowers/specs/2026-04-04-kinetic-oracle-redesign-design.md`

**Stitch Project:** `projects/9479176202914513182` — fetch screens via Stitch MCP for pixel reference

---

## Phase 1: Design Token Foundation

### Task 1: Install lucide-react and fonts

**Files:**
- Modify: `package.json`
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Install lucide-react**

```bash
cd nightshift-web && npm install lucide-react
```

- [ ] **Step 2: Update layout.tsx — swap fonts**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from 'next'
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'

import { AppShell } from '@/components/layout/app-shell'
import { Providers } from '@/providers/providers'

import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['300', '400', '500', '600', '700'],
})
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'NightShift — The Kinetic Oracle',
  description: 'AI-Powered Algorithmic Trading Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
```

- [ ] **Step 3: Verify build compiles**

```bash
cd nightshift-web && npm run build 2>&1 | head -20
```

Expected: Build succeeds (or only warns about pages, no font/import errors)

- [ ] **Step 4: Commit**

```bash
git add package.json package-lock.json src/app/layout.tsx
git commit -m "feat: swap fonts to Space Grotesk + Inter, add lucide-react"
```

---

### Task 2: Replace globals.css with Kinetic Oracle tokens

**Files:**
- Rewrite: `src/app/globals.css`

- [ ] **Step 1: Replace globals.css entirely**

Write the following to `src/app/globals.css`:

```css
@import "tailwindcss";

/* ═══ THE KINETIC ORACLE — DESIGN SYSTEM ═══ */

@theme inline {
  /* Fonts */
  --font-sans: var(--font-sans);
  --font-mono: var(--font-mono);
  --font-headline: var(--font-headline);

  /* Surfaces */
  --color-background: #131314;
  --color-surface: #131314;
  --color-surface-dim: #131314;
  --color-surface-bright: #3a393a;
  --color-surface-container-lowest: #0e0e0f;
  --color-surface-container-low: #1c1b1c;
  --color-surface-container: #201f20;
  --color-surface-container-high: #2a2a2b;
  --color-surface-container-highest: #353436;
  --color-surface-variant: #353436;
  --color-surface-tint: #00e639;

  /* Primary (Green) */
  --color-primary: #ebffe2;
  --color-primary-container: #00ff41;
  --color-primary-fixed: #72ff70;
  --color-primary-fixed-dim: #00e639;

  /* On-Primary */
  --color-on-primary: #003907;
  --color-on-primary-container: #007117;
  --color-on-primary-fixed: #002203;
  --color-on-primary-fixed-variant: #00530e;

  /* Secondary (Cyan) */
  --color-secondary: #a2e7ff;
  --color-secondary-container: #00d2fd;
  --color-secondary-fixed: #b4ebff;
  --color-secondary-fixed-dim: #3cd7ff;

  /* On-Secondary */
  --color-on-secondary: #003642;
  --color-on-secondary-container: #005669;
  --color-on-secondary-fixed: #001f27;
  --color-on-secondary-fixed-variant: #004e5f;

  /* Tertiary (Purple — AI/Logic) */
  --color-tertiary: #fff7ff;
  --color-tertiary-container: #ecd4ff;
  --color-tertiary-fixed: #efdbff;
  --color-tertiary-fixed-dim: #dcb8ff;

  /* On-Tertiary */
  --color-on-tertiary: #480081;
  --color-on-tertiary-container: #8726df;
  --color-on-tertiary-fixed: #2c0051;
  --color-on-tertiary-fixed-variant: #6700b5;

  /* Text / On-Surface */
  --color-on-surface: #e5e2e3;
  --color-on-surface-variant: #b9ccb2;
  --color-on-background: #e5e2e3;

  /* Error */
  --color-error: #ffb4ab;
  --color-error-container: #93000a;
  --color-on-error: #690005;
  --color-on-error-container: #ffdad6;

  /* Outline */
  --color-outline: #84967e;
  --color-outline-variant: #3b4b37;

  /* Inverse */
  --color-inverse-surface: #e5e2e3;
  --color-inverse-on-surface: #313031;
  --color-inverse-primary: #006e16;

  /* Border Radius (ROUND_FOUR — tight) */
  --radius-sm: 0.125rem;
  --radius: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;
  --radius-2xl: 1rem;
}

/* ═══ BASE ═══ */
body {
  background: var(--color-background);
  color: var(--color-on-surface);
  font-family: var(--font-sans), 'Inter', system-ui, sans-serif;
}

/* ═══ CUSTOM SCROLLBAR ═══ */
::-webkit-scrollbar { width: 4px; height: 4px; }
::-webkit-scrollbar-track { background: var(--color-background); }
::-webkit-scrollbar-thumb { background: var(--color-surface-container-highest); border-radius: 2px; }
::-webkit-scrollbar-thumb:hover { background: var(--color-outline); }

/* ═══ SELECTION ═══ */
::selection { background: var(--color-primary-container); color: var(--color-on-primary); }

/* ═══ FOCUS ═══ */
:focus-visible { outline: 1px solid var(--color-primary-container); outline-offset: 2px; }

/* ═══ GLASSMORPHISM ═══ */
.glass-panel {
  background: rgba(53, 52, 54, 0.6);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
}

/* ═══ GLOW EFFECTS ═══ */
.tier-1-glow { box-shadow: 0 0 15px rgba(0, 255, 65, 0.15); }
.tier-2-glow { box-shadow: 0 0 15px rgba(0, 210, 253, 0.15); }
.tier-3-glow { box-shadow: 0 0 20px rgba(135, 38, 223, 0.4); }
.glow-green { box-shadow: 0 0 10px rgba(0, 255, 65, 0.4); }
.glow-cyan { box-shadow: 0 0 10px rgba(0, 210, 253, 0.4); }
.glow-purple { box-shadow: 0 0 10px rgba(236, 212, 255, 0.5); }

/* ═══ TABULAR NUMBERS ═══ */
.tabular-nums { font-variant-numeric: tabular-nums; }

/* ═══ FONT SHORTCUTS ═══ */
.font-headline { font-family: var(--font-headline), 'Space Grotesk', sans-serif; }
.font-body { font-family: var(--font-sans), 'Inter', sans-serif; }

/* ═══ DASH ANIMATION (Flow pipelines) ═══ */
@keyframes dash-animation {
  0% { stroke-dashoffset: 10; }
  100% { stroke-dashoffset: 0; }
}
```

- [ ] **Step 2: Verify build compiles**

```bash
cd nightshift-web && npm run build 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: replace VOID Terminal tokens with Kinetic Oracle design system"
```

---

## Phase 2: Shared Layout

### Task 3: Rewrite Sidebar

**Files:**
- Rewrite: `src/components/layout/sidebar.tsx`

- [ ] **Step 1: Rewrite sidebar.tsx**

```tsx
'use client'

import { useAtomValue } from 'jotai'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  TrendingUp,
  Database,
  Bot,
  Workflow,
  ArrowLeftRight,
  BarChart3,
  Shield,
  Settings,
  Sparkles,
  FileText,
  HelpCircle,
  Terminal,
} from 'lucide-react'

import { wsStatusAtom } from '@/stores/app'

const mainNavItems = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/markets', label: 'Markets', icon: TrendingUp },
  { href: '/data-store', label: 'Data Store', icon: Database },
  { href: '/agents', label: 'Agents', icon: Bot },
  { href: '/strategies', label: 'Strategies', icon: Workflow },
  { href: '/trades', label: 'Trades', icon: ArrowLeftRight },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/risk', label: 'Risk', icon: Shield },
  { href: '/settings', label: 'Settings', icon: Settings },
]

const bottomNavItems = [
  { href: '/skills', label: 'Skills', icon: Sparkles },
  { href: '/reports', label: 'Reports', icon: FileText },
]

export function Sidebar() {
  const wsStatus = useAtomValue(wsStatusAtom)
  const pathname = usePathname()

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href))

  return (
    <aside className="bg-surface-container-low text-on-surface font-body text-sm font-medium flex flex-col h-screen fixed left-0 top-0 py-6 px-4 w-64 z-50 border-r border-outline-variant/10">
      {/* Brand */}
      <div className="mb-10 px-2 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-primary-container flex items-center justify-center text-on-primary font-bold text-sm">
          N
        </div>
        <div>
          <h1 className="text-primary font-headline font-bold text-lg leading-none">
            NightShift
          </h1>
          <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">
            Algorithmic Core
          </span>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="flex-1 space-y-1">
        {mainNavItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 ${
                active
                  ? 'text-primary bg-surface-container-highest rounded-lg border-l-4 border-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container-high rounded-lg border-l-4 border-transparent'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom Nav */}
      <div className="mt-auto space-y-1 pt-6 border-t border-outline-variant/10">
        {bottomNavItems.map((item) => {
          const active = isActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 transition-all duration-200 ${
                active
                  ? 'text-primary bg-surface-container-highest rounded-lg border-l-4 border-primary-container'
                  : 'text-on-surface-variant hover:bg-surface-container-high rounded-lg border-l-4 border-transparent'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          )
        })}

        {/* WebSocket Status */}
        <div className="flex items-center gap-2 px-3 py-2.5 mt-2">
          <div className="relative">
            <div
              className={`w-2 h-2 rounded-full ${
                wsStatus === 'connected'
                  ? 'bg-primary-container shadow-[0_0_8px_rgba(0,255,65,0.6)]'
                  : wsStatus === 'reconnecting'
                    ? 'bg-secondary animate-pulse'
                    : 'bg-error'
              }`}
            />
            {wsStatus === 'connected' && (
              <div className="absolute inset-0 w-2 h-2 rounded-full animate-ping bg-primary-container/40" />
            )}
          </div>
          <span className="text-xs text-on-surface-variant">
            {wsStatus === 'connected' ? 'Live' : wsStatus === 'reconnecting' ? 'Reconnecting...' : 'Disconnected'}
          </span>
        </div>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Verify build**

```bash
cd nightshift-web && npm run build 2>&1 | head -20
```

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/sidebar.tsx
git commit -m "feat: rewrite sidebar with Kinetic Oracle design — Lucide icons, green active border"
```

---

### Task 4: Simplify AppShell and remove Header

**Files:**
- Rewrite: `src/components/layout/app-shell.tsx`
- Delete: `src/components/layout/header.tsx`

- [ ] **Step 1: Rewrite app-shell.tsx**

```tsx
'use client'

import { motion } from 'framer-motion'

import { Sidebar } from './sidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div className="ml-64 flex flex-col min-h-screen">
        <main className="flex-1 p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Delete header.tsx**

```bash
rm src/components/layout/header.tsx
```

- [ ] **Step 3: Remove sidebarOpenAtom usage if no longer needed**

Check `src/stores/app.ts` — keep the atom (other components might reference it) but it's no longer toggled. No file change needed unless build fails.

- [ ] **Step 4: Verify build**

```bash
cd nightshift-web && npm run build 2>&1 | head -30
```

Fix any import errors for `Header` or `sidebarOpenAtom` references.

- [ ] **Step 5: Commit**

```bash
git add src/components/layout/app-shell.tsx
git add -u src/components/layout/header.tsx
git commit -m "feat: simplify AppShell — remove header, fixed sidebar layout"
```

---

### Task 5: Start dev server and verify Phase 1+2 with Chrome MCP

**Files:** None (verification only)

- [ ] **Step 1: Start dev server**

```bash
cd nightshift-web && npm run dev &
```

Wait for "Ready" message.

- [ ] **Step 2: Navigate to dashboard via Chrome MCP**

Use `navigate_page` to `http://localhost:3000`

- [ ] **Step 3: Take screenshot**

Use `take_screenshot` and visually verify:
- Background is `#131314` (not `#050508`)
- Sidebar is `#1c1b1c` with Lucide icons
- Active nav item has green left border
- No header bar at top
- NightShift logo with "Algorithmic Core" subtitle
- Text colors match Kinetic Oracle tokens

- [ ] **Step 4: Fix any visual issues found**

Iterate on globals.css or sidebar.tsx until the foundation matches.

---

## Phase 3: Page-by-Page Redesign

### Task 6: Dashboard (`/`)

**Files:**
- Rewrite: `src/app/page.tsx`

- [ ] **Step 1: Read current dashboard page**

Read `src/app/page.tsx` to understand all data bindings and interactions.

- [ ] **Step 2: Rewrite dashboard with Kinetic Oracle styling**

Restyle to match Stitch "NightShift Dashboard" screen:
- Portfolio value hero: `bg-surface-container-lowest rounded-xl p-6`, value in `font-headline font-black text-4xl text-primary`, change percentage in `text-primary-container`
- Equity curve: Restyle Recharts with `stroke="#00ff41"`, `fill="url(#greenGradient)"` where gradient goes from `rgba(0,255,65,0.2)` to transparent
- Stats row: StatCard pattern — `bg-surface-container-lowest rounded-xl p-5` with `text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-mono` labels
- Watchlist section: Cards with symbol, live price (PriceCell), change %
- Active trades: Cards with direction badge (`bg-primary/20 text-primary` for BUY, `bg-error/10 text-error` for SELL)
- Recent strategies: Clickable cards with status badge

Preserve all existing data hooks: `useStrategies()`, `useTrades()`, performance hooks, equity curve. Preserve all links and navigation. Preserve Framer Motion entrance animations.

- [ ] **Step 3: Verify with Chrome MCP screenshot**

Navigate to `http://localhost:3000`, take screenshot, compare to Stitch Dashboard screenshot.

- [ ] **Step 4: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: redesign Dashboard with Kinetic Oracle — portfolio hero, equity curve, watchlist"
```

---

### Task 7: Markets (`/markets`) + Chart (`/chart/[symbol]`)

**Files:**
- Rewrite: `src/app/markets/page.tsx`
- Restyle: `src/components/markets/watchlist-table.tsx`
- Restyle: `src/components/markets/price-cell.tsx`
- Restyle: `src/app/chart/[symbol]/page.tsx` (or client component)
- Restyle: `src/components/charts/candlestick-chart.tsx`
- Restyle: `src/components/charts/timeframe-selector.tsx`

- [ ] **Step 1: Read all current market files**

- [ ] **Step 2: Restyle WatchlistTable**

Apply DataTable pattern:
- `divide-y divide-outline-variant/5`
- Header: `text-on-surface-variant text-[11px] uppercase tracking-wider`
- Rows: `hover:bg-surface-container-low transition-all`
- Symbol column: `font-headline font-semibold`

- [ ] **Step 3: Restyle PriceCell**

Change flash colors: `text-primary-container` (up) / `text-error` (down). Keep animation logic.

- [ ] **Step 4: Restyle Markets page**

Match Stitch "Markets: Fixed Sidebar Layout":
- Chart area with `bg-surface-container-lowest rounded-xl`
- Symbol selector / instrument header
- Indicator values displayed as stat pills

- [ ] **Step 5: Restyle CandlestickChart colors**

Update Lightweight Charts config:
```tsx
layout: { background: { color: '#131314' }, textColor: '#b9ccb2' },
grid: { vertLines: { color: '#1c1b1c' }, horzLines: { color: '#1c1b1c' } },
upColor: '#00ff41', downColor: '#ff4444',
```

- [ ] **Step 6: Restyle TimeframeSelector**

Active: `bg-primary-container/20 text-primary border border-primary-container/40`
Inactive: `text-on-surface-variant hover:bg-surface-container-high`

- [ ] **Step 7: Restyle Chart view page**

Indicator grid → key-value pairs in `bg-surface-container-lowest` cards.

- [ ] **Step 8: Verify with Chrome MCP**

Navigate to `/markets` and `/chart/EUR_USD`, take screenshots.

- [ ] **Step 9: Commit**

```bash
git add src/app/markets/ src/components/markets/ src/components/charts/ src/app/chart/
git commit -m "feat: redesign Markets and Chart with Kinetic Oracle — watchlist, chart colors, indicators"
```

---

### Task 8: Agents (`/agents`)

**Files:**
- Rewrite: `src/app/agents/page.tsx`
- Rewrite: `src/components/agents/agent-card.tsx`

- [ ] **Step 1: Read current agents page and component**

- [ ] **Step 2: Rewrite agent-card.tsx**

Match Stitch "Agent Intelligence" card pattern:
- `bg-surface-container-lowest p-5 rounded-xl`
- `border-l-4` — `border-primary` for Tier 1, `border-secondary` for Tier 2
- Glow: `tier-1-glow` / `tier-2-glow` classes
- Icon area: `p-2 bg-primary/10 rounded-lg text-primary` (Tier 1) or `bg-secondary/10 text-secondary` (Tier 2)
- Tier badge: `text-[10px] font-mono bg-primary/20 text-primary px-2 py-0.5 rounded`
- Title: `font-headline font-bold text-lg`
- Status: `text-[10px] font-mono`
- Hover: `hover:bg-surface-container-low`
- Active: `ring-1 ring-primary/30`

Preserve: expand/collapse for insight data, confidence display, symbol filter, 10s refetch.

- [ ] **Step 3: Rewrite agents page**

Match Stitch layout:
- Page title: `text-4xl lg:text-5xl font-headline font-bold uppercase tracking-tight`
- Subtitle: `text-on-surface-variant max-w-2xl font-light`
- Sentiment gauge: GlassPanel with gradient bar (derive from agent insight confidence)
- Agent grid: `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4`
- Tier 1 cards (4): News, Order Flow, Session, Correlation — green accents
- Tier 2 cards (4): Range, Bias, Liquidity, Structure — cyan accents
- Reasoning log section: `bg-surface-container-lowest rounded-xl`, `font-mono text-xs`, color-coded entries
- Agent orb: circular `bg-tertiary-container/20` with nested circles and `animate-ping` + purple glow
- CTA card: `bg-primary p-6 rounded-xl` with "SYNCHRONIZE ALL AGENTS" heading and dark button

Preserve: symbol filter dropdown, agent insights data, 10s refetch, all existing hooks.

- [ ] **Step 4: Verify with Chrome MCP**

Navigate to `/agents`, take screenshot, compare to Stitch "Agent Intelligence" screenshot.

- [ ] **Step 5: Commit**

```bash
git add src/app/agents/ src/components/agents/
git commit -m "feat: redesign Agents with Kinetic Oracle — tiered cards, sentiment gauge, agent orb"
```

---

### Task 9: Strategies (`/strategies`) + Strategy Detail (`/strategies/[id]`)

**Files:**
- Rewrite: `src/app/strategies/page.tsx`
- Restyle: `src/components/strategies/strategy-table.tsx` → convert to card grid
- Restyle: `src/components/strategies/create-strategy-form.tsx`
- Rewrite: `src/app/strategies/[id]/strategy-detail-client.tsx`

- [ ] **Step 1: Read all current strategy files**

- [ ] **Step 2: Redesign strategies page**

Match Stitch "Strategy Logic & Performance":
- Strategy cards in grid (not table): `bg-surface-container-lowest rounded-xl p-5`
- Each card: name, status toggle, stats (trades, win%, P&L), mini Recharts sparkline
- "Oracle Insights" section: AI recommendation card
- Create strategy button: primary CTA style

Preserve: `useStrategies()`, `useToggleStrategy()`, CreateStrategyForm, all form fields and validation.

- [ ] **Step 3: Restyle CreateStrategyForm**

Inputs: `bg-surface-container-highest rounded-lg px-4 py-3 text-on-surface border border-outline-variant/20 focus:border-primary-container/40`
Labels: `text-on-surface-variant text-[11px] uppercase tracking-wider`
Submit: `bg-primary-container text-on-primary font-bold py-3 rounded-lg`
Cancel: `text-on-surface-variant` (text-only button)

- [ ] **Step 4: Redesign strategy detail**

Match Stitch "Autonomous Strategy Control":
- Hero: strategy name + growth percentage in `font-headline font-black text-6xl text-primary`
- Stats: total trades, equity, uptime as StatCards
- Strategy runs → terminal-style log: `font-mono text-xs`, timestamps, color-coded decisions
- Enable/Disable button: keep toggle, restyle colors

Preserve: `useStrategy()`, `useStrategyRuns()`, `useTrades()`, toggle functionality, 10s refetch.

- [ ] **Step 5: Verify with Chrome MCP**

Navigate to `/strategies` and `/strategies/{id}`, take screenshots.

- [ ] **Step 6: Commit**

```bash
git add src/app/strategies/ src/components/strategies/
git commit -m "feat: redesign Strategies with Kinetic Oracle — card grid, detail hero, terminal logs"
```

---

### Task 10: Strategy Pipeline Flow (`/strategies/[id]/flow`)

**Files:**
- Restyle: `src/app/strategies/[id]/flow/flow-page-client.tsx`
- Restyle: `src/components/flow/pipeline-flow.tsx`
- Restyle: `src/components/flow/agent-node.tsx`

- [ ] **Step 1: Read current flow files**

- [ ] **Step 2: Restyle AgentNode**

Match Stitch "Interactive Strategy Decision Pipeline" nodes:
- Node bg: `bg-surface-container-high border border-outline-variant/20 rounded-xl p-4`
- Active node: `border-primary-container/40 shadow-[0_0_10px_rgba(0,255,65,0.4)]`
- Title: `font-headline font-semibold text-sm`
- Status text: `text-[10px] font-mono text-on-surface-variant`

- [ ] **Step 3: Restyle PipelineFlow**

- ReactFlow background: `#131314`
- Edge style: `stroke="#00ff41"`, `strokeDasharray="5 5"`, animated
- Controls: restyle with surface-container-high bg

- [ ] **Step 4: Restyle flow page**

Add trade detail sidebar if space allows (or keep as-is, restyled with tokens).

- [ ] **Step 5: Verify with Chrome MCP**

- [ ] **Step 6: Commit**

```bash
git add src/app/strategies/*/flow/ src/components/flow/
git commit -m "feat: redesign Pipeline Flow with Kinetic Oracle — styled nodes, green edges"
```

---

### Task 11: Trades (`/trades`) + Trade Detail (`/trades/[id]`)

**Files:**
- Restyle: `src/app/trades/page.tsx`
- Restyle: `src/components/trades/trade-table.tsx`
- Restyle: `src/app/trades/[id]/trade-detail-client.tsx`

- [ ] **Step 1: Read current trade files**

- [ ] **Step 2: Restyle TradeTable**

DataTable pattern:
- `divide-y divide-outline-variant/5`
- Headers: `text-on-surface-variant text-[11px] uppercase tracking-wider`
- Direction: `bg-primary/20 text-primary px-2 py-0.5 rounded-full text-[10px] font-mono uppercase` (BUY) / `bg-error/10 text-error` (SELL)
- P&L: `text-primary-container` (positive) / `text-error` (negative), `font-mono tabular-nums`
- Status badges: new Badge pattern
- Expandable reasoning: `border-l-2 border-on-tertiary-container bg-surface-container-lowest p-4 font-mono text-xs`

Filter buttons: active → `bg-primary/20 text-primary border border-primary-container/40`, inactive → `text-on-surface-variant border border-outline-variant/20`

Preserve: OrderForm with all fields, charge calculation, order placement, filter state, 10s refetch.

- [ ] **Step 3: Restyle OrderForm**

All inputs: `bg-surface-container-highest rounded-lg` with ghost focus borders.
BUY button: `bg-primary-container text-on-primary`
SELL button: `bg-error text-on-error`
Charge breakdown: `bg-surface-container-lowest rounded-xl p-4 font-mono`

- [ ] **Step 4: Restyle Trade Detail**

- Chart: same Lightweight Charts config as Task 7
- Trade info: StatCard components
- Reasoning: `border-l-2 border-on-tertiary-container` block

Preserve: all data, timeframe selector, chart interactions.

- [ ] **Step 5: Verify with Chrome MCP**

- [ ] **Step 6: Commit**

```bash
git add src/app/trades/ src/components/trades/
git commit -m "feat: redesign Trades with Kinetic Oracle — data table, order form, trade detail"
```

---

### Task 12: Analytics (`/analytics`) + Risk (`/risk`)

**Files:**
- Restyle: `src/app/analytics/page.tsx`
- Restyle: `src/components/analytics/equity-curve.tsx`
- Restyle: `src/components/analytics/performance-grid.tsx`
- Restyle: `src/app/risk/page.tsx`

- [ ] **Step 1: Read current analytics and risk files**

- [ ] **Step 2: Restyle PerformanceGrid**

5 StatCards:
- Each: `bg-surface-container-lowest rounded-xl p-5`
- Label: `text-on-surface-variant text-[10px] uppercase tracking-[0.2em] font-mono`
- Value: `font-headline font-bold text-2xl`
- Colors: trades=`text-secondary`, wins=`text-primary`, losses=`text-error`, win_rate=conditional, P&L=conditional

- [ ] **Step 3: Restyle EquityCurve**

Recharts: `stroke="#00ff41"`, area gradient `rgba(0,255,65,0.15)` → transparent, bg `#0e0e0f`, grid lines `#1c1b1c`, axis text `#b9ccb2`.

- [ ] **Step 4: Restyle Analytics page**

Page title in `font-headline font-bold text-3xl uppercase tracking-tight`.

- [ ] **Step 5: Restyle Risk page**

- Margins grid → 4 StatCards
- Holdings table → DataTable pattern
- Positions table → DataTable with live P&L colors
- Keep ₹ formatting, 5s/10s refetch intervals

- [ ] **Step 6: Verify with Chrome MCP**

- [ ] **Step 7: Commit**

```bash
git add src/app/analytics/ src/components/analytics/ src/app/risk/
git commit -m "feat: redesign Analytics and Risk with Kinetic Oracle — stat cards, equity curve"
```

---

### Task 13: Settings (`/settings`)

**Files:**
- Rewrite: `src/app/settings/page.tsx`

- [ ] **Step 1: Read current settings page** (already read above)

- [ ] **Step 2: Redesign Settings**

Match Stitch "Settings & Authentication":
- Page heading: "System Configuration" in `font-headline font-bold text-3xl`
- Subtitle: `text-on-surface-variant font-light`
- Connections → card grid: each connection in `bg-surface-container-lowest rounded-xl p-5` with status dot (green glow / red)
- Account settings → card with key-value rows, `font-mono` values
- Trading mode switch → keep confirmation dialog, restyle as GlassPanel modal
- Token request → "Update API Authentication" card with button
- About → small card at bottom

Preserve: `useAccount()`, `useTradingConfig()`, `useSwitchMode()`, `useRequestDailyToken()`, all interactions and confirmation dialog.

- [ ] **Step 3: Verify with Chrome MCP**

- [ ] **Step 4: Commit**

```bash
git add src/app/settings/
git commit -m "feat: redesign Settings with Kinetic Oracle — system config cards, API auth"
```

---

### Task 14: Reports (`/reports`) + Skills (`/skills`)

**Files:**
- Restyle: `src/app/reports/page.tsx`
- Restyle: `src/app/skills/page.tsx`

- [ ] **Step 1: Read current reports and skills pages**

- [ ] **Step 2: Restyle Reports**

- Report cards: `bg-surface-container-lowest rounded-xl p-5`
- Date: `font-headline text-lg font-semibold`
- P&L: color-coded, `font-mono tabular-nums`
- Summary: `text-on-surface-variant`
- Empty state: `text-on-surface-variant` centered

- [ ] **Step 3: Restyle Skills**

- Category headers: `text-on-surface-variant text-[11px] uppercase tracking-wider`
- Skill cards: `bg-surface-container-lowest rounded-xl p-4` expandable
- Content: `bg-surface-container rounded-lg p-4 font-mono text-xs`
- Empty state: `text-on-surface-variant` centered

- [ ] **Step 4: Verify with Chrome MCP**

- [ ] **Step 5: Commit**

```bash
git add src/app/reports/ src/app/skills/
git commit -m "feat: redesign Reports and Skills with Kinetic Oracle tokens"
```

---

### Task 15: Data Store page (NEW)

**Files:**
- Create: `src/app/data-store/page.tsx`

- [ ] **Step 1: Create data-store page**

New page matching Stitch "Data Store: Indicators & Metrics":
- Uses existing `useStoreSnapshot()` hook for data
- Hero stats row: 4 StatCards (candle count, latest price, ATR value, bias)
- Indicator table: DataTable with symbols as rows, indicators as columns
- "Neural Core Analysis" section: AI analysis card with reasoning text derived from store data

```tsx
'use client'

import { useStoreSnapshot } from '@/hooks/useStoreSnapshot'

export default function DataStorePage() {
  const { data: snapshot, isLoading } = useStoreSnapshot('EUR_USD')

  // ... build page with Kinetic Oracle styling
  // Same patterns as other pages: surface-container-lowest cards,
  // font-headline headings, font-mono data values, etc.
}
```

- [ ] **Step 2: Verify with Chrome MCP**

- [ ] **Step 3: Commit**

```bash
git add src/app/data-store/
git commit -m "feat: add Data Store page matching Stitch design — indicator metrics, neural core"
```

---

## Phase 4: Final Verification

### Task 16: Full screenshot verification

- [ ] **Step 1: Ensure dev server is running**

```bash
cd nightshift-web && npm run dev
```

- [ ] **Step 2: Screenshot ALL pages via Chrome MCP**

Navigate to each route and take screenshot:
1. `/` — Dashboard
2. `/markets` — Markets
3. `/agents` — Agents
4. `/strategies` — Strategies
5. `/trades` — Trades
6. `/analytics` — Analytics
7. `/risk` — Risk
8. `/settings` — Settings
9. `/reports` — Reports
10. `/skills` — Skills
11. `/data-store` — Data Store

- [ ] **Step 3: Compare each screenshot against Stitch reference**

For each page with a Stitch screen, compare:
- Color tokens (backgrounds, text, accents)
- Typography (font family, size, weight, tracking)
- Spacing (padding, gaps, margins)
- Borders (ghost borders, left accents, no hard lines)
- Shadows (glows, not drop shadows)
- Component patterns (cards, badges, tables)

- [ ] **Step 4: Fix any remaining visual discrepancies**

Iterate until all pages match.

- [ ] **Step 5: Final build verification**

```bash
cd nightshift-web && npm run build
```

Ensure zero build errors.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "fix: final visual polish — pixel-perfect Kinetic Oracle match"
```
