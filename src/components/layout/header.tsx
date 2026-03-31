'use client'

import { useAtom } from 'jotai'

import { sidebarOpenAtom } from '@/stores/app'

export function Header() {
  const [isOpen, setIsOpen] = useAtom(sidebarOpenAtom)

  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm flex items-center px-4 gap-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-zinc-400 hover:text-white transition-colors"
      >
        {isOpen ? '◁' : '▷'}
      </button>
      <h1 className="text-sm font-medium text-zinc-300">NightShift Trading Platform</h1>
    </header>
  )
}
