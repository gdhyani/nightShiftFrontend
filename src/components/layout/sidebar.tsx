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
