import type { Metadata } from 'next'
import { DM_Sans, JetBrains_Mono } from 'next/font/google'

import { AppShell } from '@/components/layout/app-shell'
import { Providers } from '@/providers/providers'

import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-sans' })
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' })

export const metadata: Metadata = {
  title: 'NightShift',
  description: 'AI-Powered Algorithmic Trading Platform',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans`}>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  )
}
