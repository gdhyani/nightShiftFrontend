# NightShift Frontend Redesign: "The Kinetic Oracle"

> Full visual redesign of nightshift-web from "VOID Terminal" to "The Kinetic Oracle" design system.
> Source of truth: Google Stitch project `projects/9479176202914513182` (10 screens, 12 HTML files).
> Design token contract: `DESIGN.md` in project root.

---

## 1. Context & Motivation

NightShift is an AI-powered algorithmic trading platform with a Next.js 16 frontend (nightshift-web). The frontend was built during Phases 1-8 with a "VOID Terminal" dark theme. A comprehensive new design system — "The Kinetic Oracle" — was created in Google Stitch with 10 pixel-perfect screen designs covering all major pages.

**Goal:** Replace the entire visual layer to match the Stitch designs pixel-perfectly while preserving all existing functionality, data hooks, state management, and API integrations.

**What does NOT change:**
- React Query hooks (`src/hooks/`)
- Jotai atoms (`src/stores/app.ts`)
- API client (`src/lib/api.ts`)
- WebSocket client (`src/lib/ws.ts`)
- TypeScript types (`src/types/api.ts`)
- Providers (`src/providers/providers.tsx`)
- TradingView Lightweight Charts integration
- ReactFlow pipeline visualization (restyled, not rewritten)
- Recharts equity curve (restyled, not rewritten)

---

## 2. Current State: "VOID Terminal" Theme

### 2.1 Existing Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS v4 via `@tailwindcss/postcss`
- **State:** Jotai atoms + TanStack React Query v5
- **Animation:** Framer Motion v12
- **Charts:** Lightweight Charts v5 + Recharts v3
- **Flow:** @xyflow/react v12
- **No explicit tailwind.config** — Tailwind v4 defaults with CSS variable overrides

### 2.2 Current Design Tokens (globals.css)

| Token | Current Value | Purpose |
|-------|--------------|---------|
| `--void` | `#050508` | Page background |
| `--void-surface` | `#0a0a12` | Card backgrounds |
| `--void-elevated` | `#0f0f1a` | Elevated UI |
| `--void-border` | `#1a1a2e` | Normal borders |
| `--void-border-subtle` | `#12121f` | Subtle borders |
| `--text-primary` | `#e4e4ef` | Main text |
| `--text-secondary` | `#6b6b8a` | Secondary text |
| `--text-muted` | `#3d3d5c` | Muted text |
| `--accent-emerald` | `#10b981` | Success/active |
| `--accent-rose` | `#f43f5e` | Danger/sell |
| `--accent-cyan` | `#06b6d4` | Info |
| `--accent-amber` | `#f59e0b` | Warning |
| `--font-sans` | DM Sans | Body font |
| `--font-mono` | JetBrains Mono | Code font |

### 2.3 Current Special Effects (to be removed)
- Noise texture overlay (fractal noise SVG filter)
- Body radial gradient blurs (emerald, cyan, rose)
- `.scanline` animated overlay
- `.card-glow` emerald hover glow
- Custom scrollbar with void colors

### 2.4 Current Components

| Component | File | Current Styling |
|-----------|------|----------------|
| **AppShell** | `layout/app-shell.tsx` | Sidebar + Header wrapper, spring margin transition |
| **Sidebar** | `layout/sidebar.tsx` | Collapsible 240px↔68px, gradient bg, unicode icons, WS indicator |
| **Header** | `layout/header.tsx` | 56px sticky, backdrop-blur, toggle + clock |
| **EquityCurve** | `analytics/equity-curve.tsx` | Recharts area chart, emerald gradient |
| **PerformanceGrid** | `analytics/performance-grid.tsx` | 5-column stats grid |
| **CandlestickChart** | `charts/candlestick-chart.tsx` | Lightweight Charts, void colors |
| **TimeframeSelector** | `charts/timeframe-selector.tsx` | Timeframe buttons |
| **WatchlistTable** | `markets/watchlist-table.tsx` | Symbol list with indicators |
| **PriceCell** | `markets/price-cell.tsx` | Animated price flash |
| **StrategyTable** | `strategies/strategy-table.tsx` | Table with toggle switches |
| **CreateStrategyForm** | `strategies/create-strategy-form.tsx` | Form dialog |
| **AgentCard** | `agents/agent-card.tsx` | Expandable insight card, tier colors |
| **TradeTable** | `trades/trade-table.tsx` | Filtered table, expandable rows |
| **PipelineFlow** | `flow/pipeline-flow.tsx` | ReactFlow diagram |
| **AgentNode** | `flow/agent-node.tsx` | Custom flow node |

### 2.5 Current Pages (14 routes)

| Route | Current State |
|-------|--------------|
| `/` | Dashboard — equity curve, recent trades, active strategies |
| `/markets` | Watchlist table + chart link |
| `/chart/[symbol]` | Candlestick chart page |
| `/strategies` | Strategy list + create form |
| `/strategies/[id]` | Strategy detail |
| `/strategies/[id]/flow` | Pipeline flow visualization |
| `/trades` | Trade history table |
| `/trades/[id]` | Trade detail with chart |
| `/analytics` | Performance grid + equity curve |
| `/agents` | Agent insight cards |
| `/risk` | Risk & capital management |
| `/reports` | Daily trading reports |
| `/skills` | Skills overview |
| `/settings` | Application settings |

---

## 3. Target State: "The Kinetic Oracle" Design System

### 3.1 Design Philosophy
"Cockpit of Intelligence" — high-contrast typography scales, intentional asymmetry, deep tonal layering. Data treated as a living entity. UI recedes into the background, leaving only logic and profit visible.

**Core Rules:**
- **No-Line Rule:** No 1px solid borders to section UI. Use background shifts and nesting depth instead.
- **Glass & Gradient Rule:** Floating elements use glassmorphism (surface-variant at 60% + backdrop-blur: 24px).
- **Never pure white:** Use `on-surface` (#e5e2e3) for text.
- **Neon as light sources:** Accent colors (#00ff41, #00d2fd, #8726df) feel like light, not color.

### 3.2 Complete Color Token Map (60+ tokens)

#### Surfaces
| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#131314` | Page background |
| `surface` | `#131314` | Base surface |
| `surface-dim` | `#131314` | Dimmed surface |
| `surface-bright` | `#3a393a` | Bright surface |
| `surface-container-lowest` | `#0e0e0f` | Card wells, deepest inset |
| `surface-container-low` | `#1c1b1c` | Sidebar, section bg |
| `surface-container` | `#201f20` | Mid-level containers |
| `surface-container-high` | `#2a2a2b` | Cards, elevated |
| `surface-container-highest` | `#353436` | Inputs, active workspace |
| `surface-variant` | `#353436` | Glass base (60% opacity) |
| `surface-tint` | `#00e639` | Tinted surfaces |

#### Primary (Green — Buy/Success/CTA)
| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#ebffe2` | Light green text |
| `primary-container` | `#00ff41` | Neon green buttons, glows |
| `primary-fixed` | `#72ff70` | Fixed green |
| `primary-fixed-dim` | `#00e639` | Dimmed green |
| `on-primary` | `#003907` | Text on primary |
| `on-primary-container` | `#007117` | Text on primary containers |
| `on-primary-fixed` | `#002203` | Text on primary fixed |
| `on-primary-fixed-variant` | `#00530e` | Text on primary fixed variant |

#### Secondary (Cyan — Market Data/Info)
| Token | Hex | Usage |
|-------|-----|-------|
| `secondary` | `#a2e7ff` | Cyan text |
| `secondary-container` | `#00d2fd` | Bright cyan container |
| `secondary-fixed` | `#b4ebff` | Fixed cyan |
| `secondary-fixed-dim` | `#3cd7ff` | Dimmed cyan |
| `on-secondary` | `#003642` | Text on secondary |
| `on-secondary-container` | `#005669` | Text on secondary containers |
| `on-secondary-fixed` | `#001f27` | Text on secondary fixed |
| `on-secondary-fixed-variant` | `#004e5f` | Text on secondary fixed variant |

#### Tertiary (Purple — AI/Logic)
| Token | Hex | Usage |
|-------|-----|-------|
| `tertiary` | `#fff7ff` | Near-white AI labels |
| `tertiary-container` | `#ecd4ff` | Lavender agent orbs |
| `tertiary-fixed` | `#efdbff` | Fixed lavender |
| `tertiary-fixed-dim` | `#dcb8ff` | Dimmed lavender |
| `on-tertiary` | `#480081` | Deep purple text |
| `on-tertiary-container` | `#8726df` | Vivid purple accents |
| `on-tertiary-fixed` | `#2c0051` | Text on tertiary fixed |
| `on-tertiary-fixed-variant` | `#6700b5` | Text on tertiary fixed variant |

#### Text / On-Surface
| Token | Hex | Usage |
|-------|-----|-------|
| `on-surface` | `#e5e2e3` | Primary text |
| `on-surface-variant` | `#b9ccb2` | Secondary text, labels |
| `on-background` | `#e5e2e3` | Text on background |

#### Error
| Token | Hex | Usage |
|-------|-----|-------|
| `error` | `#ffb4ab` | Error text |
| `error-container` | `#93000a` | Error backgrounds |
| `on-error` | `#690005` | Text on error |
| `on-error-container` | `#ffdad6` | Text on error containers |

#### Outline / Borders
| Token | Hex | Usage |
|-------|-----|-------|
| `outline` | `#84967e` | Visible outlines (rare) |
| `outline-variant` | `#3b4b37` | Ghost borders (at 10-30% opacity) |

#### Inverse
| Token | Hex | Usage |
|-------|-----|-------|
| `inverse-surface` | `#e5e2e3` | Inverse surface |
| `inverse-on-surface` | `#313031` | Text on inverse |
| `inverse-primary` | `#006e16` | Inverse primary |

### 3.3 Typography

| Role | Font | Tailwind Class | Usage |
|------|------|---------------|-------|
| Headlines | Space Grotesk | `font-headline` | Display text, prices, page titles |
| Body | Inter | `font-body` | All functional text |
| Code | JetBrains Mono | `font-mono` | Trade IDs, JSON, logs |

**Type Scale:** text-9xl, text-8xl, text-6xl, text-4xl, text-3xl, text-2xl, text-lg, text-base, text-[11px], text-[10px], text-[9px], text-[8px]

**Weights:** font-black (900), font-extrabold (800), font-bold (700), font-semibold (600), font-medium (500), font-light (300)

**Tracking:** tracking-widest (all-caps badges), tracking-wider (uppercase headings), tracking-[0.2em], tracking-tight, tracking-tighter

**Line Height:** leading-none (display numbers), leading-tight (headings), leading-relaxed (body)

**Rule:** All monetary values use `font-variant-numeric: tabular-nums` for stable layout during live updates.

### 3.4 Border Radius (Stitch: ROUND_FOUR)

| Tailwind | Value | Usage |
|----------|-------|-------|
| `rounded` (DEFAULT) | 0.125rem (2px) | Default elements |
| `rounded-lg` | 0.25rem (4px) | Nav items, small cards |
| `rounded-xl` | 0.5rem (8px) | Cards, containers |
| `rounded-full` | 0.75rem (12px) | Pills, badges, orbs |

**Note:** These are much tighter than standard Tailwind. The Stitch config overrides defaults.

### 3.5 Shadows & Glows

**No traditional shadows.** Only ambient glows and one floating shadow:

| Pattern | CSS | Usage |
|---------|-----|-------|
| Small green | `0 0 8px #00ff41` | Active indicators |
| Medium green | `0 0 10px rgba(0,255,65,0.4)` | Hover states |
| Large green | `0 0 15px rgba(0,255,65,0.15)` | Tier 1 agent cards, CTAs |
| Ambient green | `0 0 40px rgba(0,255,65,0.2)` | Hero elements |
| Cyan | `0 0 8px #00d2fd` | Secondary active |
| Soft cyan | `0 0 15px rgba(0,210,253,0.15)` | Tier 2 agent cards |
| Purple | `0 0 20px #ecd4ff` | Agent orbs |
| Ambient purple | `0 0 40px rgba(236,212,255,0.4)` | Orb pulse |
| Active ring | `0 0 0 2px #00ff41, 0 0 20px rgba(0,255,65,0.3)` | Active buy signal |
| Float shadow | `0 10px 15px -3px rgba(0,0,0,0.4)` | Modals only |

### 3.6 Glassmorphism

```css
background: rgba(53, 52, 54, 0.6);  /* surface-variant at 60% */
backdrop-filter: blur(24px);
```

### 3.7 Border Patterns

| Pattern | Usage |
|---------|-------|
| `border-outline-variant/5` | Nearly invisible |
| `border-outline-variant/10` | Ghost border — sidebar right edge, card containment |
| `border-outline-variant/20` | Standard ghost border |
| `border-outline-variant/30` | Slightly visible |
| `border-l-4 border-primary` | Green left accent — active nav, Tier 1 cards |
| `border-l-4 border-secondary` | Cyan left accent — Tier 2 cards |
| `border-l-2 border-on-tertiary-container` | Purple accent — AI reasoning |
| `border-primary-container/40` | Active input focus |
| `ring-1 ring-primary/30` | Selected card focus ring |
| `divide-y divide-outline-variant/5` | Table row dividers |

### 3.8 Animations

| Pattern | CSS/Class | Usage |
|---------|----------|-------|
| Pulse | `animate-pulse` | Agent orbs, live indicators |
| Ping | `animate-ping` | Notification dots |
| Transition | `duration-200`, `duration-300` | Standard hover/state changes |
| Slow glow | `duration-[3000ms]` | Ambient glow cycling |
| Dash | `animation: dash-animation 1s linear infinite` | Flow pipeline connections |

### 3.9 Gradient Patterns

| Pattern | Usage |
|---------|-------|
| `bg-gradient-to-t from-background/40` | Fade-up overlays |
| `from-primary-container/10 to-transparent` | Subtle green bg |
| `from-tertiary-container/5 to-transparent` | Subtle purple bg |
| `radial-gradient(circle at center, ...)` | Radial glow backgrounds |
| `linear-gradient(135deg, #ebffe2, #00ff41)` | Primary CTA button |

---

## 4. Stitch Screen → Page Mapping

| Stitch Screen | Target Page | Current Page Exists? |
|--------------|-------------|---------------------|
| "NightShift Dashboard (Sidebar with Analytics)" | `/` | Yes — needs full restyle |
| "Markets: Fixed Sidebar Layout" | `/markets` + `/chart/[symbol]` | Yes — needs full restyle |
| "Agent Intelligence" + "Agent Insights" | `/agents` | Yes — needs full restyle |
| "Strategy Logic & Performance" | `/strategies` | Yes — needs full restyle |
| "Autonomous Strategy Control" | `/strategies/[id]` | Yes — needs full restyle |
| "Interactive Strategy Decision Pipeline" | `/strategies/[id]/flow` | Yes — needs full restyle |
| "Data Store: Indicators & Metrics" | New `/data-store` page OR integrated into `/markets` | **New page needed or remap** |
| "Settings & Authentication" | `/settings` | Yes — needs full restyle |
| No Stitch screen | `/trades`, `/trades/[id]` | Yes — restyle with tokens |
| No Stitch screen | `/analytics` | Yes — restyle with tokens |
| No Stitch screen | `/risk` | Yes — restyle with tokens |
| No Stitch screen | `/reports` | Yes — restyle with tokens |
| No Stitch screen | `/skills` | Yes — restyle with tokens |

---

## 5. Implementation Plan: Layered Swap

### Phase 1: Design Token Foundation

**Files modified:**
- `src/app/globals.css` — Full rewrite
- `src/app/layout.tsx` — Font imports
- `tailwind.config.ts` — New file with full Kinetic Oracle theme
- `package.json` — Add `lucide-react`

**What changes:**

| Aspect | VOID Terminal (Current) | Kinetic Oracle (Target) |
|--------|------------------------|------------------------|
| Background | `#050508` | `#131314` |
| Surface | `#0a0a12` | `#0e0e0f` to `#353436` (6 levels) |
| Borders | `#1a1a2e` (solid) | `#3b4b37` at 10-30% opacity (ghost) |
| Primary accent | `#10b981` (emerald) | `#00ff41` (neon green) |
| Secondary accent | `#06b6d4` (cyan) | `#00d2fd` (bright cyan) |
| Danger | `#f43f5e` (rose) | `#ffb4ab` (error) |
| AI/Logic color | None | `#8726df` / `#ecd4ff` (purple) |
| Text primary | `#e4e4ef` | `#e5e2e3` |
| Text secondary | `#6b6b8a` | `#b9ccb2` |
| Headline font | DM Sans | Space Grotesk |
| Body font | DM Sans | Inter |
| Code font | JetBrains Mono | JetBrains Mono (unchanged) |
| Border radius | Tailwind defaults | 2px/4px/8px/12px (tight) |
| Effects | Noise texture, scanline, radial blurs | Glassmorphism, neon glows |
| CSS approach | Custom properties + utility classes | 60+ semantic tokens + Tailwind extend |

**Removed:** `.card`, `.card-glow`, `.badge-*`, `.scanline`, `.stat-value` utility classes, noise SVG filter, body radial gradients.

**Added:** `.glass-panel`, `.tier-1-glow`, `.tier-2-glow`, glow shadow utilities, tabular-nums utility.

### Phase 2: Shared Layout (Sidebar + AppShell)

**Files modified:**
- `src/components/layout/sidebar.tsx` — Full rewrite
- `src/components/layout/app-shell.tsx` — Simplify
- `src/components/layout/header.tsx` — Delete

**Sidebar — Current vs Target:**

| Aspect | Current | Target |
|--------|---------|--------|
| Width | 240px / 68px (collapsible) | Fixed 256px (w-64) |
| Collapse | Spring animation toggle | None — always expanded |
| Background | `linear-gradient(180deg, #0a0a14, #060609)` | Flat `#1c1b1c` |
| Right border | None | `border-r border-outline-variant/10` |
| Logo | Text "NightShift" only | Green icon (auto_graph) + "NightShift" + "Algorithmic Core" subtitle |
| Icons | Unicode (⬡ ◯ ⬢ ⇅ ◇ ⊘ ◉ ❖ ☰ ⚙) | Lucide React icons |
| Active state | Emerald bg tint | `bg-[#353436] rounded-lg border-l-4 border-[#00ff41]` (no translate) |
| Inactive hover | Subtle bg | `hover:bg-[#2a2a2b]` |
| Text active | `#10b981` | `#ebffe2` |
| Text inactive | `#6b6b8a` | `#b9ccb2` |
| Nav items | 10 items flat | 8 main + 2 bottom (Support, Logs) separated by ghost border |
| WS status | Bottom indicator dot | Keep — restyle to match |
| Bottom section | None | `border-t border-outline-variant/10` separator |

**Lucide Icon Mapping:**

| Page | Material Symbol (Stitch) | Lucide Equivalent |
|------|-------------------------|-------------------|
| Dashboard | `dashboard` | `LayoutDashboard` |
| Markets | `monitoring` | `TrendingUp` |
| Data Store | `database` | `Database` |
| Agents | `smart_toy` | `Bot` |
| Strategies | `precision_manufacturing` | `Settings2` or `Workflow` |
| Trades | `swap_horiz` | `ArrowLeftRight` |
| Analytics | `leaderboard` | `BarChart3` |
| Settings | `settings` | `Settings` |
| Support | `help` | `HelpCircle` |
| Logs | `terminal` | `Terminal` |

**AppShell — Changes:**
- Remove `Header` component entirely
- Remove sidebar collapse state & animation
- Fixed `ml-64` on content area
- Remove Framer Motion spring transition for margin
- Keep Framer Motion page transition (opacity + y)

**Header — Deleted:**
- Stitch designs have no top header bar
- Clock functionality can move to sidebar bottom if needed
- Sidebar toggle button removed (sidebar is always expanded)

### Phase 3: Page-by-Page Component Redesign

#### Shared Components (built during 3a, reused everywhere)

**StatCard** — New shared component
```
Background: bg-surface-container-lowest (#0e0e0f)
Padding: p-5
Border radius: rounded-xl
Label: text-on-surface-variant text-[10px] uppercase tracking-[0.2em] font-mono
Value: font-headline font-bold text-2xl+
Optional: glow shadow, colored value
```

**Badge / StatusPill** — Replaces current `.badge-*` classes
```
Shape: rounded-full
Padding: px-2 py-0.5
Font: text-[10px] font-mono font-semibold uppercase tracking-widest
Colors: tinted bg at 10-20% opacity with matching text
  - Success: bg-primary/20 text-primary
  - Info: bg-secondary/20 text-secondary
  - AI: bg-tertiary-container/20 text-on-tertiary-container
  - Error: bg-error/10 text-error
  - Neutral: bg-on-surface-variant/40 text-on-surface-variant
```

**GlassPanel** — New shared component
```
Background: bg-surface-variant/60
Backdrop: backdrop-blur-[24px]
Border: border border-outline-variant/10
Border radius: rounded-xl
```

**AgentCard** — Restyle existing `agents/agent-card.tsx`
```
Background: bg-surface-container-lowest
Padding: p-5
Border radius: rounded-xl
Left accent: border-l-4 (primary for Tier 1, secondary for Tier 2)
Glow: tier-1-glow / tier-2-glow
Icon: p-2 bg-{color}/10 rounded-lg
Status: text-[10px] font-mono
Hover: bg-surface-container-low
Active: ring-1 ring-primary/30
```

**DataTable** — Restyle pattern for all tables
```
Dividers: divide-y divide-outline-variant/5
Header: text-on-surface-variant text-[11px] uppercase tracking-wider
Cells: px-4 py-3
Row hover: hover:bg-surface-container-low
```

#### 3a. Dashboard (`/`)

**Stitch reference:** "NightShift Dashboard (Sidebar with Analytics)"

| Section | Current | Target |
|---------|---------|--------|
| Portfolio hero | Card with monospace value | Surface-lowest well, Space Grotesk font-black value, green glow |
| Equity curve | Recharts with emerald gradient | Restyle colors: primary line, surface-container bg |
| Watchlist | Basic table | Cards with symbol, price (PriceCell), change %, mini sparkline |
| Active trades | Simple list | Cards with direction badge, entry/exit, P&L colored |
| AI Insights | None or basic | Right panel: live insight stream with agent avatars |
| Status badges | Emerald/rose | OANDA/MT5/LLM connection badges (green dot = connected) |
| Layout | Single column | 2/3 + 1/3 split (main content + insights sidebar) |

#### 3b. Markets (`/markets` + `/chart/[symbol]`)

**Stitch reference:** "Markets: Fixed Sidebar Layout"

| Section | Current | Target |
|---------|---------|--------|
| Chart | Lightweight Charts, void colors | Restyle: #131314 bg, green/red candles, #00ff41 indicator lines |
| Header | Basic symbol display | Symbol dropdown + indicator toggles (EMA, VWAP, MACD) |
| Right panel | None | Strategy alignment panel: strategy names + % scores |
| Watchlist | WatchlistTable component | Compact list below chart or in sidebar |
| Indicator panel | None | Floating toggle panel for overlays |
| MACD | None | Separate histogram panel below chart |

#### 3c. Agents (`/agents`)

**Stitch references:** "Autonomous Agent Intelligence" + "Agent Insights"

| Section | Current | Target |
|---------|---------|--------|
| Page title | Basic heading | `text-4xl lg:text-5xl font-headline font-bold uppercase tracking-tight` |
| Sentiment gauge | None | GlassPanel with gradient bar (bearish red → neutral → bullish green) |
| Agent grid | Expandable cards | 4-column grid, Tier 1 (green border-l-4) + Tier 2 (cyan border-l-4) |
| Agent cards | Basic expandable | AgentCard component with icon, tier badge, status, hover glow |
| Reasoning log | None | Terminal-style log panel: font-mono, color-coded [INIT]/[LOG]/[REASONING]/[SIGNAL] |
| Agent orb | None | Circular tertiary-container with pulse animation + purple glow |
| CTA section | None | Green bg-primary card "SYNCHRONIZE ALL AGENTS" with dark button |

#### 3d. Strategies (`/strategies`)

**Stitch reference:** "Strategy Logic & Performance" (library view)

| Section | Current | Target |
|---------|---------|--------|
| Strategy list | StrategyTable with toggles | Strategy cards in grid: mini equity chart, stats (trades, win%, P&L), toggle |
| Create form | CreateStrategyForm dialog | Restyle form inputs with surface-container-highest bg, ghost focus borders |
| Insights | None | "Oracle Insights: Strategy Optimization" section with AI recommendations |
| Agent activity | None | Log sidebar showing recent agent decisions |

#### 3d-detail. Strategy Detail (`/strategies/[id]`)

**Stitch reference:** "Autonomous Strategy Control"

| Section | Current | Target |
|---------|---------|--------|
| Hero | Basic title | Strategy name + growth % hero + total trades + equity curve |
| Flow diagram | Linked to separate /flow page | Inline AlgoWave Logic Flow (simplified node diagram) |
| Parameters | None | Active Logic Parameters panel (aggression, slippage, drawdown) |
| Runtime logs | None | Terminal-style log with timestamps |
| Node health | None | Status indicators per pipeline node |

#### 3e. Strategy Pipeline Flow (`/strategies/[id]/flow`)

**Stitch reference:** "Interactive Strategy Decision Pipeline"

| Section | Current | Target |
|---------|---------|--------|
| Flow layout | ReactFlow with custom nodes | Restyle nodes: surface-container-high bg, ghost borders, column layout |
| Connections | Default edges | SVG marching-ants animation (dashed, animated stroke-dashoffset) |
| Node types | AgentNode basic | Ingestion, Tier 1 Agent, Tier 2 Agent, Filter, Execution node types |
| Trade detail | None in flow | Right sidebar panel with trade rationale, entry/exit, confidence |
| Log | None | Bottom terminal panel with flow execution log |

#### 3f. Data Store (new route or remap)

**Stitch reference:** "Data Store: Indicators & Metrics"

| Section | Target |
|---------|--------|
| Hero stats | 4 StatCards: candle count, latest price, ATR, bias |
| Data table | Multi-symbol rows with EMA, VWAP, Volume, ATR, RSI columns + sparklines |
| Neural Core | AI analysis panel with reasoning text |
| Auto-pause | Toggle button for automated ingestion |

**Decision needed:** Create new `/data-store` route or integrate into existing `/markets` page. Recommend new route since Stitch has it as a separate screen.

#### 3g. Trades (`/trades` + `/trades/[id]`)

**No dedicated Stitch screen — follow token system**

| Section | Current | Target |
|---------|---------|--------|
| Trade table | TradeTable with filters | Restyle with DataTable pattern, ghost borders, colored P&L |
| Filter buttons | Basic buttons | Badge/pill style filters with active state glow |
| Expandable rows | Reasoning text | Keep — restyle with font-mono, border-l-2 accent |
| Trade detail | Chart + reasoning | Restyle card backgrounds, typography |

#### 3h. Analytics + Risk (`/analytics` + `/risk`)

**No dedicated Stitch screen — follow token system**

| Section | Current | Target |
|---------|---------|--------|
| Equity curve | Recharts with emerald | Restyle: primary line, surface-lowest bg, ghost grid |
| Performance grid | 5-column stats | StatCard components with glows |
| Risk params | Basic display | Cards with ghost borders, warning colors for limits |

#### 3i. Settings (`/settings`)

**Stitch reference:** "Settings & Authentication"

| Section | Current | Target |
|---------|---------|--------|
| Layout | Basic settings page | "System Configuration" heading, card-based form sections |
| Connections | 2x2 grid with StatusDot | Card-based with green glow dots, "System Configuration" heading |
| Account / Risk | Flat key-value list | Card with risk params: risk_per_trade, daily_loss_limit, max_drawdown, max_position_size |
| Connected services | None | Webhook Listener + API Access Tokens cards |
| System metrics | None | Uptime/latency display at bottom |

#### 3j. Reports + Skills (`/reports` + `/skills`)

**No dedicated Stitch screens — follow token system**

Apply design tokens, replace cards with StatCard/surface-lowest pattern, restyle tables with DataTable pattern.

---

## 6. Font Loading

Replace current DM Sans import with:
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

Or use `next/font/google` for optimal loading:
```tsx
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google'
```

---

## 7. Tailwind Config (New)

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#131314',
        surface: {
          DEFAULT: '#131314',
          dim: '#131314',
          bright: '#3a393a',
          container: {
            DEFAULT: '#201f20',
            lowest: '#0e0e0f',
            low: '#1c1b1c',
            high: '#2a2a2b',
            highest: '#353436',
          },
          variant: '#353436',
          tint: '#00e639',
        },
        primary: {
          DEFAULT: '#ebffe2',
          container: '#00ff41',
          fixed: { DEFAULT: '#72ff70', dim: '#00e639' },
        },
        'on-primary': {
          DEFAULT: '#003907',
          container: '#007117',
          fixed: { DEFAULT: '#002203', variant: '#00530e' },
        },
        secondary: {
          DEFAULT: '#a2e7ff',
          container: '#00d2fd',
          fixed: { DEFAULT: '#b4ebff', dim: '#3cd7ff' },
        },
        'on-secondary': {
          DEFAULT: '#003642',
          container: '#005669',
          fixed: { DEFAULT: '#001f27', variant: '#004e5f' },
        },
        tertiary: {
          DEFAULT: '#fff7ff',
          container: '#ecd4ff',
          fixed: { DEFAULT: '#efdbff', dim: '#dcb8ff' },
        },
        'on-tertiary': {
          DEFAULT: '#480081',
          container: '#8726df',
          fixed: { DEFAULT: '#2c0051', variant: '#6700b5' },
        },
        'on-surface': { DEFAULT: '#e5e2e3', variant: '#b9ccb2' },
        'on-background': '#e5e2e3',
        outline: { DEFAULT: '#84967e', variant: '#3b4b37' },
        error: { DEFAULT: '#ffb4ab', container: '#93000a' },
        'on-error': { DEFAULT: '#690005', container: '#ffdad6' },
        inverse: {
          surface: '#e5e2e3',
          'on-surface': '#313031',
          primary: '#006e16',
        },
      },
      borderRadius: {
        DEFAULT: '0.125rem',
        lg: '0.25rem',
        xl: '0.5rem',
        full: '0.75rem',
      },
      fontFamily: {
        headline: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config
```

---

## 8. Verification Plan

After each page implementation in Phase 3:

1. **Start dev server:** `cd nightshift-web && npm run dev`
2. **Navigate** via Chrome MCP `navigate_page` to the implemented page
3. **Screenshot** via Chrome MCP `take_screenshot`
4. **Compare** screenshot against corresponding Stitch screenshot
5. **Fix** any visual discrepancies (colors, spacing, typography, borders, glows)
6. **Re-screenshot** until matching
7. **Move to next page**

Final verification: screenshot ALL pages in sequence and present to user for review.

---

## 9. Features NOT in Stitch — Must Preserve

These features exist in the current system but have NO dedicated Stitch screen. They must be restyled using the Kinetic Oracle token system while preserving all functionality.

### 9.1 Interactive Forms

**OrderForm** (currently in `/trades`):
- Side toggle (BUY/SELL) → restyle as pill buttons with `bg-primary/20` (buy) and `bg-error/10` (sell)
- Quantity input → `bg-surface-container-highest`, `focus:border-primary-container/40`
- Order type dropdown → same input styling
- Price input → same input styling
- "Calculate Charges" button → secondary button style
- "Place Order" button → primary CTA (`bg-primary-container text-on-primary`)
- Charge breakdown → surface-container-lowest card with mono font

**CreateStrategyForm** (currently in `/strategies`):
- Name input → `bg-surface-container-highest`, ghost focus border
- Symbols input → same
- Interval dropdown → same
- Submit → primary CTA
- Cancel → tertiary button (text only)

### 9.2 Pages Without Stitch Screens

**Trade Detail** (`/trades/[id]`):
- Candlestick chart → restyle with `#131314` bg, `#00ff41`/`#ff4444` candles
- Trade info grid → StatCard components
- Status badge → new Badge component
- P&L → color-coded with primary (profit) / error (loss)
- Reasoning section → border-l-2 border-on-tertiary-container, font-mono, surface-container-lowest bg

**Chart View** (`/chart/[symbol]`):
- Timeframe selector → pill buttons, active state with primary bg
- Indicator grid → key-value pairs in surface-container-lowest cards
- Chart → same restyle as trade detail chart

**Portfolio & Risk** (`/risk`):
- Margins grid → 4 StatCards (Balance, Equity, Margin Used, Available)
- Holdings table → DataTable pattern
- Positions table → DataTable pattern with live P&L coloring
- All currency → keep ₹ formatting

**Reports** (`/reports`):
- Report cards → surface-container-lowest bg, rounded-xl
- Date → font-headline, text-lg
- P&L → color-coded
- Summary → text-on-surface-variant

**Skills** (`/skills`):
- Skill cards → surface-container-lowest, expandable
- Category grouping → keep, use text-on-surface-variant headers
- Content block → font-mono, surface-container bg

### 9.3 Interactions to Preserve

| Interaction | Current Location | Redesign Approach |
|-------------|-----------------|-------------------|
| **Live trading mode switch** with confirmation dialog | Settings | Keep dialog — restyle as GlassPanel modal with error-colored "Go Live" CTA |
| **Token request** button + status dots | Settings | Map to "Update API Authentication" card pattern from Stitch |
| **WebSocket status indicator** | Sidebar bottom | Keep — restyle with Kinetic Oracle colors (primary=connected, error=disconnected, secondary=reconnecting) |
| **Strategy toggle** (enable/disable) | Strategy table | Keep toggle — restyle with primary-container track color |
| **Live price flash** (PriceCell) | Markets watchlist | Keep animation — use primary (up) / error (down) flash colors |
| **Agent symbol filter** dropdown | Agents page | Keep — restyle as surface-container-highest select input |
| **Trade row expand** (reasoning) | Trades table | Keep — restyle expanded area with border-l-2 tertiary accent |
| **Skill card expand** (content) | Skills page | Keep — restyle with font-mono content area |
| **Strategy runs list** | Strategy detail | Restyle as terminal-style log with font-mono, timestamps |

### 9.4 Real-Time Data Refresh (Must Preserve)

| Hook | Interval | Page |
|------|----------|------|
| `useStrategyRuns` | 10s | Strategy detail |
| `useTrades` | 10s | Trades |
| `usePositions` | 5s | Dashboard, Risk |
| `useAgentInsights` | 10s | Agents |
| `usePortfolioHoldings` | 10s | Risk |
| `usePortfolioPositions` | 5s | Risk |
| `usePortfolioMargins` | 10s | Risk |
| `useTradingConfig` | 30s | Settings |
| `useAuthStatus` | 10s | Settings |
| WebSocket `price_ticks` | Real-time | Markets, Dashboard |

### 9.5 Loading & Empty States

All pages must preserve their loading/empty/error states, restyled:
- **Loading:** Skeleton pulse with `bg-surface-container-high animate-pulse`
- **Empty:** Centered text in `text-on-surface-variant` with subtle icon
- **Error:** `text-error` message with `bg-error-container/20` background

---

## 10. Stitch Designs Have But Current System Lacks

Features shown in Stitch that the current system does NOT have yet. These are **visual only** — we'll build the UI shells with placeholder/mock data where backend support doesn't exist.

| Stitch Feature | Screen | Current Status | Approach |
|---------------|--------|---------------|----------|
| Sentiment gauge (bearish→bullish bar) | Agent Intelligence | Not implemented | Build UI, derive from agent insights confidence |
| Agent orb (pulsating purple sphere) | Agent Intelligence | Not implemented | Build as visual component, no backend needed |
| "SYNCHRONIZE ALL AGENTS" CTA | Agent Intelligence | Not implemented | Build button, wire to future endpoint or no-op |
| Reasoning log terminal | Agent Intelligence | Not implemented | Build UI, populate from latest agent insights |
| Strategy library cards with mini charts | Strategies | Currently a table | Redesign as cards with mini Recharts sparklines |
| AlgoWave Logic Flow inline diagram | Strategy Detail | Currently links to /flow | Build simplified inline version |
| Active Logic Parameters panel | Strategy Detail | Not implemented | Build UI shell, populate from strategy config |
| Neural Core Analysis section | Data Store | Not implemented | Build UI, derive from store snapshot data |
| Node health status indicators | Strategy Detail | Not implemented | Build visual, derive from latest run stages |
| Strategy optimization insights | Strategies | Not implemented | Build "Oracle Insights" card, populate from agent data |
| Agent activity log sidebar | Strategies | Not implemented | Build log panel, populate from agent insights |
| Connected services (Webhook, API tokens) | Settings | Not implemented | Build UI shells — visual only for now |
| System metrics (uptime, latency) | Settings | Not implemented | Build UI shell — visual only for now |

---

## 11. Navigation Mapping

### Current Sidebar (10 items) → New Sidebar (10 items)

| Current | Icon (Unicode) | New | Icon (Lucide) | Route |
|---------|---------------|-----|--------------|-------|
| Dashboard | ⬢ | Dashboard | `LayoutDashboard` | `/` |
| Markets | ◯ | Markets | `TrendingUp` | `/markets` |
| — | — | Data Store (NEW) | `Database` | `/data-store` |
| Strategies | ⬢ | Strategies | `Workflow` | `/strategies` |
| Trades | ⇅ | Trades | `ArrowLeftRight` | `/trades` |
| Analytics | ◇ | Analytics | `BarChart3` | `/analytics` |
| Risk | ⊘ | Risk | `Shield` | `/risk` |
| Agents | ◯ | Agents | `Bot` | `/agents` |
| Skills | ✶ | — (moved to bottom) | — | — |
| Reports | ☰ | — (moved to bottom) | — | — |
| Settings | ⚙ | Settings | `Settings` | `/settings` |

### Bottom Section (below divider)

| Item | Icon (Lucide) | Route |
|------|--------------|-------|
| Skills | `Sparkles` | `/skills` |
| Reports | `FileText` | `/reports` |
| Support | `HelpCircle` | External/modal |
| Logs | `Terminal` | `/logs` or modal |

### WebSocket Status (preserved at sidebar bottom)
```
● Connected    → w-2 h-2 rounded-full bg-primary-container shadow-[0_0_8px_#00ff41]
● Reconnecting → w-2 h-2 rounded-full bg-secondary animate-pulse
● Disconnected → w-2 h-2 rounded-full bg-error
```

---

## 12. Out of Scope

- Mobile responsive design (Stitch screens are desktop-only at 2560px)
- New backend API endpoints (UI shells built for missing features)
- Authentication/login pages
- Dark/light mode toggle (dark only)
- Performance optimization (separate concern)

---

## 10. Risk & Dependencies

| Risk | Mitigation |
|------|-----------|
| Tailwind v4 config format differs from v3 | Verify Tailwind v4 theme extend syntax; may need `@theme` directive in CSS instead of config file |
| Lightweight Charts color API | Check chart color configuration options; may need wrapper |
| ReactFlow node styling | Custom node components already exist; restyle className only |
| Recharts color configuration | Pass new color props to existing components |
| Lucide icons may not have exact Material Symbol equivalents | Map closest matches; document any deviations |
