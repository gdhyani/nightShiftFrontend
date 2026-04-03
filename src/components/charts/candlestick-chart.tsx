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
        background: { type: ColorType.Solid, color: '#09090b' },
        textColor: '#a1a1aa',
      },
      grid: {
        vertLines: { color: '#27272a' },
        horzLines: { color: '#27272a' },
      },
      crosshair: {
        vertLine: { color: '#71717a', labelBackgroundColor: '#27272a' },
        horzLine: { color: '#71717a', labelBackgroundColor: '#27272a' },
      },
      width: containerRef.current.clientWidth,
      height,
      timeScale: { borderColor: '#27272a', timeVisible: true },
      rightPriceScale: { borderColor: '#27272a' },
    })

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderDownColor: '#ef4444',
      borderUpColor: '#22c55e',
      wickDownColor: '#ef4444',
      wickUpColor: '#22c55e',
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
      <div className="flex items-center justify-center bg-zinc-950 rounded-lg" style={{ height }}>
        <span className="text-zinc-500">Loading chart...</span>
      </div>
    )
  }

  return <div ref={containerRef} className="w-full rounded-lg overflow-hidden" />
}
