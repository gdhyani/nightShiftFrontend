import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { AppShell } from '@/components/layout/app-shell'
import { Providers } from '@/providers/providers'

import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NightShift',
  description: 'AI-Powered Algorithmic Trading Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
