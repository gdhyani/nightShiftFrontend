'use client'

import Link from 'next/link'
import { PipelineFlow } from '@/components/flow/pipeline-flow'
import { useStrategy } from '@/hooks/useStrategies'

interface Props { strategyId: number }

export function FlowPageClient({ strategyId }: Props) {
  const { data: strategy } = useStrategy(strategyId)
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">{strategy?.name ?? 'Strategy'} — Pipeline Flow</h1>
          <p className="text-zinc-500 text-sm mt-1">Live visualization of the agent decision pipeline</p>
        </div>
        <Link href={`/strategies/${strategyId}`} className="text-sm text-zinc-400 hover:text-white">← Back to Strategy</Link>
      </div>
      <PipelineFlow strategyId={strategyId} />
    </div>
  )
}
