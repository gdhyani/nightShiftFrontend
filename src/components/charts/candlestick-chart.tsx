'use client'

import { useEffect, useRef } from 'react'
import { createChart, CandlestickSeries, type IChartApi, type ISeriesApi, ColorType } from 'lightweight-charts'
import { useCandles } from '@/hooks/useCandles'

interface Props {
  symbol: string
  timeframe: string
  height?: number
}

export function CandlestickChart({ symbol, timeframe, height = 500 }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const chartRef = useRef<IChartApi | null>(null)
  const seriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null)
  const { data: candles, isLoading } = useCandles(symbol, timeframe, 500)

  useEffect(() => {
    if (!containerRef.current) return

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: '#131314' },
        textColor: '#b9ccb2',
      },
      grid: {
        vertLines: { color: '#1c1b1c' },
        horzLines: { color: '#1c1b1c' },
      },
      crosshair: {
        vertLine: { color: '#71717a', labelBackgroundColor: '#2a2a2b' },
        horzLine: { color: '#71717a', labelBackgroundColor: '#2a2a2b' },
      },
      width: containerRef.current.clientWidth,
      height,
      timeScale: { borderColor: '#1c1b1c', timeVisible: true },
      rightPriceScale: { borderColor: '#1c1b1c' },
    })

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#00ff41',
      downColor: '#ff4444',
      borderDownColor: '#ff4444',
      borderUpColor: '#00ff41',
      wickDownColor: '#ff4444',
      wickUpColor: '#00ff41',
    })

    chartRef.current = chart
    seriesRef.current = series

    const observer = new ResizeObserver((entries) => {
      const { width } = entries[0].contentRect
      chart.applyOptions({ width })
    })
    observer.observe(containerRef.current)

    return () => {
      observer.disconnect()
      chart.remove()
      chartRef.current = null
      seriesRef.current = null
    }
  }, [height])

  useEffect(() => {
    if (!seriesRef.current || !candles?.length) return
    const chartData = candles.map((c) => ({
      time: (new Date(c.timestamp).getTime() / 1000) as number,
      open: c.open,
      high: c.high,
      low: c.low,
      close: c.close,
    }))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    seriesRef.current.setData(chartData as any)
    chartRef.current?.timeScale().fitContent()
  }, [candles])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center bg-surface-container-lowest rounded-xl" style={{ height }}>
        <span className="text-on-surface-variant">Loading chart...</span>
      </div>
    )
  }

  return <div ref={containerRef} className="w-full rounded-xl overflow-hidden" />
}
