'use client'

import { useAtom, useAtomValue } from 'jotai'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

import { sidebarOpenAtom, wsStatusAtom } from '@/stores/app'

const navItems = [
  { href: '/', label: 'Dashboard', icon: '\u2B21' },
  { href: '/markets', label: 'Markets', icon: '\u25CE' },
  { href: '/strategies', label: 'Strategies', icon: '\u2B22' },
  { href: '/trades', label: 'Trades', icon: '\u21C5' },
  { href: '/analytics', label: 'Analytics', icon: '\u25C8' },
  { href: '/risk', label: 'Risk', icon: '\u2298' },
  { href: '/agents', label: 'Agents', icon: '\u25C9' },
  { href: '/skills', label: 'Skills', icon: '\u2756' },
  { href: '/reports', label: 'Reports', icon: '\u2630' },
  { href: '/settings', label: 'Settings', icon: '\u2699' },
]

export function Sidebar() {
  const [isOpen] = useAtom(sidebarOpenAtom)
  const wsStatus = useAtomValue(wsStatusAtom)
  const pathname = usePathname()

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 240 : 68 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col"
      style={{
        background: 'linear-gradient(180deg, #0a0a14 0%, #060609 100%)',
        borderRight: '1px solid rgba(26, 26, 46, 0.8)',
      }}
    >
      {/* Brand */}
      <div className="h-16 flex items-center px-5 gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
          style={{
            background: 'linear-gradient(135deg, #10b981, #06b6d4)',
            boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
          }}
        >
          N
        </div>
        {isOpen && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-base font-semibold tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            NightShift
          </motion.span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 group"
              style={{
                background: isActive ? 'rgba(16, 185, 129, 0.08)' : 'transparent',
                color: isActive ? '#10b981' : 'var(--text-secondary)',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                  style={{ background: '#10b981', boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)' }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className="text-lg w-6 text-center" style={{ filter: isActive ? 'drop-shadow(0 0 4px rgba(16, 185, 129, 0.5))' : 'none' }}>
                {item.icon}
              </span>
              {isOpen && (
                <span className="group-hover:text-[var(--text-primary)] transition-colors">
                  {item.label}
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* Connection status */}
      <div className="px-4 py-4 border-t" style={{ borderColor: 'var(--void-border-subtle)' }}>
        <div className="flex items-center gap-2">
          <div className="relative">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: wsStatus === 'connected' ? '#10b981' : wsStatus === 'reconnecting' ? '#f59e0b' : '#f43f5e',
                boxShadow: wsStatus === 'connected' ? '0 0 6px rgba(16, 185, 129, 0.6)' : 'none',
              }}
            />
            {wsStatus === 'connected' && (
              <div className="absolute inset-0 w-2 h-2 rounded-full animate-ping" style={{ background: 'rgba(16, 185, 129, 0.4)' }} />
            )}
          </div>
          {isOpen && (
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {wsStatus === 'connected' ? 'Live' : wsStatus === 'reconnecting' ? 'Reconnecting...' : 'Disconnected'}
            </span>
          )}
        </div>
      </div>
    </motion.aside>
  )
}
