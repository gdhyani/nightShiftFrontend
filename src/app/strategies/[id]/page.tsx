import { StrategyDetailClient } from './strategy-detail-client'

export default async function StrategyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <StrategyDetailClient strategyId={Number(id)} />
}
