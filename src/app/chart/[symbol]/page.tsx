export default async function ChartPage({ params }: { params: Promise<{ symbol: string }> }) {
  const { symbol } = await params
  return (
    <div>
      <h1 className="text-2xl font-bold">Chart: {symbol}</h1>
      <p className="text-zinc-500 mt-2">Full TradingView chart with multi-timeframe and trade overlays</p>
    </div>
  )
}
