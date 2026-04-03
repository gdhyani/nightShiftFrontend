import { TradeDetailClient } from './trade-detail-client'

export default async function TradeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <TradeDetailClient tradeId={Number(id)} />
}
