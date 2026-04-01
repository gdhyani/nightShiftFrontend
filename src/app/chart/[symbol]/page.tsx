import { ChartViewClient } from './chart-view-client'

export default async function ChartPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params
  return <ChartViewClient symbol={symbol} />
}
