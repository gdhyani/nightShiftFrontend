import { FlowPageClient } from './flow-page-client'

export default async function StrategyFlowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <FlowPageClient strategyId={Number(id)} />
}
