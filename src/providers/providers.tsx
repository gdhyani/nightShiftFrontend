'use client'

import { QueryClientProvider } from '@tanstack/react-query'
import { Provider as JotaiProvider } from 'jotai'
import { useState } from 'react'
import { useWebSocket } from '@/hooks/useWebSocket'
import { makeQueryClient } from '@/lib/query-client'

function WebSocketInit() {
  useWebSocket()
  return null
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => makeQueryClient())

  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <WebSocketInit />
        {children}
      </QueryClientProvider>
    </JotaiProvider>
  )
}
