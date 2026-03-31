export default async function StrategyFlowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div>
      <h1 className="text-2xl font-bold">Strategy Flow: {id}</h1>
      <p className="text-zinc-500 mt-2">n8n-style agent pipeline visualization</p>
    </div>
  )
}
