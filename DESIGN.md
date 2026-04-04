# DESIGN.md — NightShift "The Kinetic Oracle" Design System

> Extracted from Google Stitch project `projects/9479176202914513182` (10 screens, 12 HTML files).
> Design philosophy: **"Cockpit of Intelligence"** — high-contrast, deep tonal layering, glassmorphism, neon accents as light sources.

---

## 1. Color Tokens

### Semantic Palette (CSS custom properties / Tailwind tokens)

| Token | Hex | Usage |
|-------|-----|-------|
| `background` | `#131314` | Page background, "the void" |
| `surface` | `#131314` | Base surface level |
| `surface-dim` | `#131314` | Dimmed surface |
| `surface-bright` | `#3a393a` | Bright surface variant |
| `surface-container-lowest` | `#0e0e0f` | Card wells, deepest inset |
| `surface-container-low` | `#1c1b1c` | Sidebar, section backgrounds |
| `surface-container` | `#201f20` | Mid-level containers |
| `surface-container-high` | `#2a2a2b` | Cards, elevated containers |
| `surface-container-highest` | `#353436` | Input fields, active workspace |
| `surface-variant` | `#353436` | Glass base (60% opacity + blur) |
| `surface-tint` | `#00e639` | Tinted surfaces |

### Primary (Green — Buy/Success/CTA)

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#ebffe2` | Light green text, primary labels |
| `primary-container` | `#00ff41` | Neon green — buttons, glows, active states |
| `primary-fixed` | `#72ff70` | Fixed green variant |
| `primary-fixed-dim` | `#00e639` | Dimmed green |
| `on-primary` | `#003907` | Text on primary surfaces |
| `on-primary-container` | `#007117` | Text on primary containers |

### Secondary (Cyan — Market Data/Info)

| Token | Hex | Usage |
|-------|-----|-------|
| `secondary` | `#a2e7ff` | Cyan text, secondary labels |
| `secondary-container` | `#00d2fd` | Bright cyan container |
| `secondary-fixed` | `#b4ebff` | Fixed cyan |
| `secondary-fixed-dim` | `#3cd7ff` | Dimmed cyan |
| `on-secondary` | `#003642` | Text on secondary surfaces |
| `on-secondary-container` | `#005669` | Text on secondary containers |

### Tertiary (Purple — AI/Logic)

| Token | Hex | Usage |
|-------|-----|-------|
| `tertiary` | `#fff7ff` | Near-white for AI labels |
| `tertiary-container` | `#ecd4ff` | Lavender — agent orbs, AI sections |
| `tertiary-fixed` | `#efdbff` | Fixed lavender |
| `tertiary-fixed-dim` | `#dcb8ff` | Dimmed lavender |
| `on-tertiary` | `#480081` | Deep purple text |
| `on-tertiary-container` | `#8726df` | Vivid purple — AI accents |

### Text / On-Surface

| Token | Hex | Usage |
|-------|-----|-------|
| `on-surface` | `#e5e2e3` | Primary text (never pure white) |
| `on-surface-variant` | `#b9ccb2` | Secondary text, metadata, labels |
| `on-background` | `#e5e2e3` | Text on background |

### Error

| Token | Hex | Usage |
|-------|-----|-------|
| `error` | `#ffb4ab` | Error text |
| `error-container` | `#93000a` | Error backgrounds |
| `on-error` | `#690005` | Text on error |
| `on-error-container` | `#ffdad6` | Text on error containers |

### Outline / Borders

| Token | Hex | Usage |
|-------|-----|-------|
| `outline` | `#84967e` | Visible outlines (rare) |
| `outline-variant` | `#3b4b37` | Ghost borders (15-20% opacity) |

### Inverse

| Token | Hex | Usage |
|-------|-----|-------|
| `inverse-surface` | `#e5e2e3` | Inverse surface |
| `inverse-on-surface` | `#313031` | Text on inverse |
| `inverse-primary` | `#006e16` | Inverse primary |

### Override Colors (Stitch theme overrides)

| Override | Hex |
|----------|-----|
| Primary | `#00FF41` |
| Secondary | `#00D4FF` |
| Tertiary | `#8A2BE2` |
| Neutral | `#0A0A0B` |

---

## 2. Typography

### Font Families

| Role | Font | Tailwind Class | Usage |
|------|------|---------------|-------|
| **Headlines** | Space Grotesk | `font-['Space_Grotesk']`, `font-headline` | Display text, market caps, prices |
| **Body** | Inter | `font-['Inter']`, `font-body` | All functional/body text |
| **Code** | JetBrains Mono | `font-mono` | Trade IDs, JSON blocks, raw data |
| **Labels** | Inter | `font-['Inter']` | Metadata, timestamps |

### Type Scale (Tailwind classes used across screens)

| Class | Approx Size | Usage |
|-------|------------|-------|
| `text-9xl` | ~8rem | Hero numbers (rare) |
| `text-8xl` | ~6rem | Large display values |
| `text-6xl` | ~3.75rem | Major price displays |
| `text-4xl` | ~2.25rem | Page titles, portfolio value |
| `text-3xl` | ~1.875rem | Section headings |
| `text-2xl` | ~1.5rem | Subheadings |
| `text-lg` | ~1.125rem | Emphasized body |
| `text-base` | ~1rem | Standard body |
| `text-[11px]` | 11px | Small labels |
| `text-[10px]` | 10px | Tiny metadata |
| `text-[9px]` | 9px | Micro labels |
| `text-[8px]` | 8px | Smallest text |

### Font Weights

| Class | Weight | Usage |
|-------|--------|-------|
| `font-black` | 900 | Hero display numbers |
| `font-extrabold` | 800 | Page titles |
| `font-bold` | 700 | Section headings, prices |
| `font-semibold` | 600 | Card titles, labels |
| `font-medium` | 500 | Body emphasis |
| `font-light` | 300 | Subtle metadata |

### Letter Spacing

| Class | Usage |
|-------|-------|
| `tracking-widest` | All-caps labels, status badges |
| `tracking-wider` | Uppercase headings |
| `tracking-[0.2em]` | Custom wide tracking |
| `tracking-tight` | Dense data displays |
| `tracking-tighter` | Compact headings |

### Line Height

| Class | Usage |
|-------|-------|
| `leading-none` | Display numbers (no line gap) |
| `leading-tight` | Headings |
| `leading-relaxed` | Body paragraphs |

### Key Rule: Tabular Numbers
All monetary values must use tabular lining (monospaced numbers) — `font-variant-numeric: tabular-nums` — to prevent layout shifts during live updates.

---

## 3. Spacing System

**Base grid:** 4px

### Padding (used across screens)

| Class | Value | Context |
|-------|-------|---------|
| `p-1` | 4px | Tight inline elements |
| `p-2` | 8px | Small buttons, badges |
| `p-3` | 12px | Compact cards |
| `p-4` | 16px | Standard card padding |
| `p-5` | 20px | Medium cards |
| `p-6` | 24px | Section padding |
| `p-8` | 32px | Large sections |
| `p-12` | 48px | Major sections |
| `p-20` | 80px | Hero areas |

### Gap (Flex/Grid gaps)

| Class | Value | Context |
|-------|-------|---------|
| `gap-1` | 4px | Tight icon groups |
| `gap-1.5` | 6px | Compact lists |
| `gap-2` | 8px | Button groups, badges |
| `gap-3` | 12px | Card content |
| `gap-4` | 16px | Standard sections |
| `gap-6` | 24px | Card grids |
| `gap-8` | 32px | Major sections |
| `gap-10` | 40px | Page sections |
| `gap-12` | 48px | Large layouts |
| `gap-24` | 96px | Hero spacing |

### Vertical Spacing (`space-y-*`)

| Class | Value |
|-------|-------|
| `space-y-1` | 4px |
| `space-y-2` | 8px |
| `space-y-3` | 12px |
| `space-y-4` | 16px |
| `space-y-6` | 24px |
| `space-y-8` | 32px |

---

## 4. Border Radius

| Class | Value | Usage |
|-------|-------|-------|
| `rounded` | 4px | Default (theme: ROUND_FOUR) |
| `rounded-lg` | 8px | Cards, containers |
| `rounded-xl` | 12px | Large cards, modals |
| `rounded-full` | 9999px | Pills, avatars, status dots, agent orbs |
| `rounded-t-sm` | 2px top | Tab-like elements |
| `10px` (inline) | 10px | Some inline styles |

**Theme setting:** `ROUND_FOUR` — default roundness is subtle (4px).

---

## 5. Shadows & Glows

### The "No Traditional Shadow" Rule
Standard Material shadows are forbidden. Only **ambient shadows** and **neon glows** are used.

### Glow Effects (primary design language)

| Tailwind Class | CSS Value | Usage |
|---------------|-----------|-------|
| `shadow-[0_0_8px_#00ff41]` | `0 0 8px #00ff41` | Small green glow — active indicators |
| `shadow-[0_0_10px_#00ff41]` | `0 0 10px #00ff41` | Medium green glow — hover states |
| `shadow-[0_0_10px_rgba(0,255,65,0.4)]` | — | Medium green glow (softer) |
| `shadow-[0_0_10px_rgba(0,255,65,0.5)]` | — | Medium green glow (stronger) |
| `shadow-[0_0_15px_#00ff41]` | `0 0 15px #00ff41` | Large green glow — CTAs |
| `shadow-[0_0_40px_rgba(0,255,65,0.2)]` | — | Ambient green glow — hero elements |
| `shadow-[0_0_8px_#00d2fd]` | `0 0 8px #00d2fd` | Cyan glow — secondary active |
| `shadow-[0_0_8px_rgba(162,231,255,0.4)]` | — | Soft cyan glow |
| `shadow-[0_0_8px_rgba(220,184,255,0.4)]` | — | Soft purple glow |
| `shadow-[0_0_20px_#ecd4ff]` | `0 0 20px #ecd4ff` | Purple glow — AI/agent orbs |
| `shadow-[0_0_10px_rgba(236,212,255,0.5)]` | — | Purple glow variant |
| `shadow-[0_0_40px_rgba(236,212,255,0.4)]` | — | Ambient purple glow |

### CSS Box Shadows (inline styles)

```css
/* Active agent / buy signal glow */
box-shadow: 0 0 0 2px #00ff41, 0 0 20px rgba(0, 255, 65, 0.3);

/* Green glow variants */
box-shadow: 0 0 15px rgba(0, 255, 65, 0.15);
box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);

/* Cyan glow */
box-shadow: 0 0 15px rgba(0, 210, 253, 0.15);

/* Purple AI glow */
box-shadow: 0 0 20px rgba(135, 38, 223, 0.4);

/* Floating element shadow (only for modals/overlays) */
box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.4);
```

---

## 6. Glassmorphism & Backdrop

### Glass Recipe
```css
background: rgba(53, 52, 54, 0.6);  /* surface-variant at 60% */
backdrop-filter: blur(24px);
```

**Tailwind:** `backdrop-blur-md` (used across screens), inline `backdrop-filter: blur(24px)`.

### Gradient Patterns

| Pattern | Usage |
|---------|-------|
| `bg-gradient-to-t from-background/40` | Fade-up overlays |
| `from-primary-container/10 to-transparent` | Subtle green gradient backgrounds |
| `from-primary/5 to-transparent` | Very subtle green tint |
| `from-tertiary-container/5 to-transparent` | Subtle purple tint |
| `from-error/10 to-transparent` | Subtle red tint for errors |
| `bg-[radial-gradient(circle_at_center,...)]` | Radial glow backgrounds |

### Button Gradient (Primary CTA)
```css
background: linear-gradient(135deg, #ebffe2, #00ff41);
```

---

## 7. Borders

### The "No-Line" Rule
Traditional 1px solid borders are **prohibited**. Boundaries are defined through background color shifts and nesting depth.

### Ghost Borders (when containment is required)

| Class | Usage |
|-------|-------|
| `border-outline-variant/5` | Nearly invisible — felt, not seen |
| `border-outline-variant/10` | Very subtle containment |
| `border-outline-variant/20` | Standard ghost border |
| `border-outline-variant/30` | Slightly visible |
| `border-[#353436]/20` | Surface-variant ghost border |
| `border-primary-container/20` | Green-tinted ghost border |
| `border-primary-container/40` | Active/focused green border |
| `border-primary/20` | Subtle primary border |
| `border-error/20` | Error ghost border |
| `border-error/30` | Error emphasis border |

### Active/Focus Borders

| Class | Usage |
|-------|-------|
| `border-[#00ff41]` | Active green border (primary-container) |
| `border-[#ebffe2]` | Primary text-color border |
| `border-primary` | Primary token border |
| `border-primary-container` | Neon green border |
| `border-error` | Error state border |
| `ring-1 ring-primary/30` | Focus ring |

### Accent Borders

| Class | Usage |
|-------|-------|
| `border-l-2` / `border-l-4` | Left accent stripe on cards/items |
| `border-b-2` | Bottom accent (active tab) |
| `border-dashed` | Dashed borders for drop zones |

---

## 8. Component Patterns

### Sidebar Navigation
- **Width:** `w-64` (256px), fixed position
- **Background:** `bg-surface-container-low` (#1c1b1c)
- **Nav items:** Text in `on-surface-variant`, active item gets `bg-primary-container/10` + `text-primary`
- **Logo:** Top-left, "NightShift" branding
- **Content area:** `ml-64` offset

### Cards
- **Background:** `bg-surface-container-lowest` (#0e0e0f) for "well" effect, or `bg-surface-container-high` (#2a2a2b) for elevated
- **Padding:** `p-4` to `p-6` (16-24px)
- **Border radius:** `rounded-lg` to `rounded-xl`
- **Border:** Ghost border `border-outline-variant/10` or `border-outline-variant/20`
- **Hover:** Background shifts to `bg-surface-container-low`
- **No traditional box shadows**

### Buttons

| Variant | Background | Text | Border | Shadow |
|---------|-----------|------|--------|--------|
| **Primary** | `bg-primary-container` (#00ff41) | `text-on-primary` (#003907) | none | `shadow-[0_0_15px_#00ff41]` |
| **Secondary** | transparent | `text-secondary` | `border-outline-variant/20` | none |
| **Tertiary/Ghost** | transparent | `text-on-surface-variant` | none | none |
| **Danger** | `bg-error` / `bg-error-container` | `text-on-error-container` | none | none |
| **Small pill** | `bg-primary/10` or `bg-secondary/10` | matching text | none | none |

### Status Badges / Pills
- **Shape:** `rounded-full` (pill shape)
- **Padding:** `px-2 py-0.5` or `px-3 py-1`
- **Font:** `text-[10px]` or `text-[11px]`, `font-semibold`, `tracking-widest`, `uppercase`
- **Colors:** Tinted backgrounds at 10-20% opacity with matching text

### Data Tables
- **Dividers:** `divide-y divide-outline-variant/5` (nearly invisible)
- **Row hover:** Subtle background shift
- **Cell padding:** `px-4 py-3`
- **Header text:** `text-on-surface-variant`, `text-[11px]`, `uppercase`, `tracking-wider`

### Agent Orbs (Specialty)
- **Shape:** Circular (`rounded-full`)
- **Fill:** `bg-tertiary-container` (#ecd4ff)
- **Glow:** `shadow-[0_0_20px_#ecd4ff]`, pulsating via `animate-pulse`
- **Size:** `w-12 h-12` to `w-16 h-16`

### Input Fields
- **Background:** `bg-surface-container-highest` (#353436)
- **Active border:** Ghost border using primary at 40% opacity
- **Label:** `text-on-surface-variant`, small size
- **Border radius:** `rounded-lg`

### Charts / Data Visualization
- **Chart background:** `bg-surface-container-lowest` (#0e0e0f)
- **Green line:** `#00ff41` (primary-container)
- **Cyan line:** `#00d2fd` (secondary-container)
- **Purple line:** `#8726df` (on-tertiary-container)
- **Grid lines:** Very low opacity outline-variant
- **Axis text:** `text-on-surface-variant` at small sizes

### Flow/Pipeline Nodes
- **Node background:** `bg-surface-container-high` with ghost border
- **Active node:** Green glow `shadow-[0_0_10px_#00ff41]`
- **Connections:** SVG paths with dashed animation `animation: dash-animation 1s linear infinite`
- **Node border:** `border-primary-container/40` when active

---

## 9. Animations & Transitions

| Pattern | Class/CSS | Usage |
|---------|----------|-------|
| Pulse | `animate-pulse` | Agent orbs, live indicators |
| Ping | `animate-ping` | Notification dots |
| Hover scale | `hover:scale-105` | Cards, buttons |
| Hover translate | `group-hover:translate-x-1` | Arrow icons on hover |
| Transition | `duration-200`, `duration-300` | Standard transitions |
| Slow transition | `duration-[3000ms]` | Ambient glow cycling |
| Ease | `ease-in` | Entry animations |
| Dash animation | `animation: dash-animation 1s linear infinite` | Flow pipeline connections |
| Transform | `transition: transform 0.3s ease-out` | Smooth transforms |

---

## 10. Layout Patterns

### Page Structure
```
┌─────────────────────────────────────────────┐
│ [Sidebar w-64]  │  [Main Content ml-64]     │
│                 │                            │
│  Logo           │  [Top Bar / Header]        │
│  Nav Items      │                            │
│  ...            │  [Content Grid]            │
│                 │                            │
│  Settings       │  [Cards / Data]            │
│  (bottom)       │                            │
└─────────────────────────────────────────────┘
```

### Max Width
- Main content: `max-w-[1600px]` or unconstrained
- Modals: `max-w-2xl`, `max-w-lg`

### Grid Patterns
- Strategy cards: 3-column grid (`grid-cols-3`)
- Agent cards: 4-column grid (`grid-cols-4`)
- Dashboard: 2/3 + 1/3 split (`w-2/3` + `w-1/3`)
- Stats row: Flexible with `gap-6`

### Responsive Breakpoints
Desktop-first design at 2560px canvas width. No mobile breakpoints observed in Stitch screens.

---

## 11. Do's and Don'ts

### Do
- Use whitespace as separator (8px padding instead of a line)
- Use `JetBrains Mono` for trade IDs and raw JSON
- Lean into asymmetry (large AI insight left, dense data tables right)
- Use neon glows as visual hierarchy signals
- Use tonal layering (background shifts) to define sections

### Don't
- Use `#ffffff` — always use `on-surface` (#e5e2e3)
- Use Material-style drop shadows
- Use high-contrast 1px borders
- Clutter AI sections — these should breathe with tertiary accents
- Use colored backgrounds at full opacity — always use /10, /20, /30 modifiers

---

## 12. Stitch Screen Reference

| # | Screen | Page Type |
|---|--------|-----------|
| 1 | Dashboard (Sidebar with Analytics) | Portfolio overview, equity curve, watchlist, active trades |
| 2 | Markets: Fixed Sidebar Layout | Candlestick chart, indicators, strategy alignment |
| 3 | Strategy Logic & Performance | Strategy library cards, optimization insights |
| 4 | Autonomous Strategy Control | Strategy detail, flow diagram, trade parameters |
| 5 | Interactive Strategy Decision Pipeline | React Flow pipeline, trade detail panel |
| 6 | Data Store: Indicators & Metrics | Indicator values, Neural Core analysis |
| 7 | Agent Insights | Agent cards with status, consensus panel |
| 8 | Autonomous Agent Intelligence | Agent grid, tier system, synchronize controls |
| 9 | Settings & Authentication | System config, API auth, risk protocol |
| 10 | NightShift Project Overview | CLAUDE.md reference (no visual) |

---

## 13. Google Fonts to Load

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

---

## 14. Tailwind Config Tokens

```js
// tailwind.config.js color extension (maps to Stitch namedColors)
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
  error: {
    DEFAULT: '#ffb4ab',
    container: '#93000a',
  },
  'on-error': { DEFAULT: '#690005', container: '#ffdad6' },
  inverse: {
    surface: '#e5e2e3',
    'on-surface': '#313031',
    primary: '#006e16',
  },
}
```
