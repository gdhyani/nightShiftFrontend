export default async function TradeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div>
      <h1 className="text-2xl font-bold">Trade Detail: {id}</h1>
      <p className="text-zinc-500 mt-2">Chart with entry/exit markers, agent reasoning chain</p>
    </div>
  )
}
