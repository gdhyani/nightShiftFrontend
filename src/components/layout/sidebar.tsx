'use client'

import { useAtom } from 'jotai'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

import { sidebarOpenAtom } from '@/stores/app'

const navItems = [
  { href: '/', label: 'Dashboard', icon: '◉' },
  { href: '/markets', label: 'Markets', icon: '◈' },
  { href: '/strategies', label: 'Strategies', icon: '◆' },
  { href: '/trades', label: 'Trades', icon: '◇' },
  { href: '/analytics', label: 'Analytics', icon: '◎' },
  { href: '/risk', label: 'Risk & Capital', icon: '◐' },
  { href: '/agents', label: 'Agent Insights', icon: '◑' },
  { href: '/skills', label: 'Skills', icon: '◒' },
  { href: '/reports', label: 'Daily Review', icon: '◓' },
  { href: '/settings', label: 'Settings', icon: '◔' },
]

export function Sidebar() {
  const [isOpen] = useAtom(sidebarOpenAtom)
  const pathname = usePathname()

  return (
    <motion.aside
      initial={false}
      animate={{ width: isOpen ? 240 : 64 }}
      className="fixed left-0 top-0 h-screen bg-zinc-950 border-r border-zinc-800 z-40 flex flex-col"
    >
      <div className="h-14 flex items-center px-4 border-b border-zinc-800">
        <span className="text-lg font-bold text-white tracking-tight">
          {isOpen ? 'NightShift' : 'NS'}
        </span>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-zinc-800 text-white'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <span className="text-base">{item.icon}</span>
              {isOpen && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>
    </motion.aside>
  )
}
