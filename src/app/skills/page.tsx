'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useSkills, useSkillContent } from '@/hooks/useSkills'

function SkillCard({ path, name, description }: { path: string; name: string; description: string }) {
  const [expanded, setExpanded] = useState(false)
  const { data: content, isLoading } = useSkillContent(expanded ? path : '')

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      className="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant/10 hover:bg-surface-container-low transition-all cursor-pointer"
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="text-sm font-medium text-on-surface">{name}</div>
        <div className="text-xs mt-1 text-on-surface-variant">{description}</div>
        <div className="text-[10px] font-mono text-on-surface-variant mt-1">{path}</div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-surface-container rounded-lg p-4 font-mono text-xs text-on-surface-variant mt-3">
              {isLoading ? (
                <div>Loading...</div>
              ) : (
                <pre className="overflow-auto max-h-64 whitespace-pre-wrap">{content?.content}</pre>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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
        <h1 className="font-headline font-bold text-3xl uppercase tracking-tight text-on-surface">Skills Manager</h1>
        <p className="text-on-surface-variant font-light mt-1">Browse agent skills and their definitions</p>
      </div>

      {isLoading ? (
        <div className="text-on-surface-variant text-center py-12">Loading skills...</div>
      ) : !skills?.length ? (
        <div className="text-on-surface-variant text-center py-12">No skills registered yet.</div>
      ) : (
        Object.entries(grouped).map(([category, catSkills]) => (
          <div key={category}>
            <h2 className="text-on-surface-variant text-[11px] uppercase tracking-wider font-mono mb-3">{category}</h2>
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
