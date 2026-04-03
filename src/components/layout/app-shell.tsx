'use client'

import { useAtom } from 'jotai'
import { motion } from 'framer-motion'

import { sidebarOpenAtom } from '@/stores/app'

import { Header } from './header'
import { Sidebar } from './sidebar'

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isOpen] = useAtom(sidebarOpenAtom)

  return (
    <div className="min-h-screen" style={{ background: 'var(--void)' }}>
      <Sidebar />
      <motion.div
        initial={false}
        animate={{ marginLeft: isOpen ? 240 : 68 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="flex flex-col min-h-screen"
      >
        <Header />
        <main className="flex-1 p-6">
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </motion.div>
    </div>
  )
}
