'use client'

import { useSetAtom } from 'jotai'
import { useEffect, useRef } from 'react'
import { NightShiftWS } from '@/lib/ws'
import { livePricesAtom, wsStatusAtom } from '@/stores/app'

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000/ws'

export function useWebSocket() {
  const setLivePrices = useSetAtom(livePricesAtom)
  const setWsStatus = useSetAtom(wsStatusAtom)
  const wsRef = useRef<NightShiftWS | null>(null)

  useEffect(() => {
    const ws = new NightShiftWS(WS_URL)
    wsRef.current = ws

    const unsub = ws.onMessage((channel, data) => {
      if (channel === 'price_ticks' && data.symbol && data.candle) {
        setLivePrices((prev) => ({ ...prev, [data.symbol as string]: data.candle as never }))
      }
    })

    ws.connect()
    setWsStatus('connected')

    return () => {
      unsub()
      ws.disconnect()
      setWsStatus('disconnected')
    }
  }, [setLivePrices, setWsStatus])
}
