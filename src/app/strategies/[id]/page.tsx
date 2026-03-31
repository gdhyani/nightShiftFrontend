export default async function StrategyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div>
      <h1 className="text-2xl font-bold">Strategy Detail: {id}</h1>
      <p className="text-zinc-500 mt-2">Live agent activity, signals, recent trades, performance</p>
    </div>
  )
}
