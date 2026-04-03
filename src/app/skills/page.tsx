'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSkills, useSkillContent } from '@/hooks/useSkills'

function SkillCard({ path, name, description }: { path: string; name: string; description: string }) {
  const [expanded, setExpanded] = useState(false)
  const { data: content, isLoading } = useSkillContent(expanded ? path : '')

  return (
    <div className="bg-zinc-900 rounded-lg p-4">
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-zinc-500 mt-1">{description}</div>
        <div className="text-xs text-zinc-600 mt-1 font-mono">{path}</div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3 border-t border-zinc-800">
              {isLoading ? (
                <div className="text-zinc-500 text-xs">Loading...</div>
              ) : (
                <pre className="text-xs text-zinc-300 overflow-auto max-h-64 whitespace-pre-wrap">{content?.content}</pre>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function SkillsPage() {
  const { data: skills, isLoading } = useSkills()

  const grouped = (skills ?? []).reduce<Record<string, typeof skills>>((acc, skill) => {
    const category = skill.path.split('/')[0] || 'general'
    if (!acc[category]) acc[category] = []
    acc[category]!.push(skill)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Skills Manager</h1>
        <p className="text-zinc-500 mt-1">Browse agent skills and their definitions</p>
      </div>

      {isLoading ? (
        <div className="text-zinc-500">Loading skills...</div>
      ) : !skills?.length ? (
        <div className="text-zinc-500">No skills registered yet.</div>
      ) : (
        Object.entries(grouped).map(([category, catSkills]) => (
          <div key={category}>
            <h2 className="text-sm font-medium text-zinc-400 mb-3 capitalize">{category}</h2>
            <div className="grid grid-cols-2 gap-3">
              {catSkills!.map((s) => (
                <SkillCard key={s.path} path={s.path} name={s.name} description={s.description} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
