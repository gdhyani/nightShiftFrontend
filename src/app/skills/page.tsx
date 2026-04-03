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
      className="rounded-2xl p-4"
      style={{ background: 'var(--void-surface)', border: '1px solid var(--void-border-subtle)' }}
    >
      <button onClick={() => setExpanded(!expanded)} className="w-full text-left">
        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{name}</div>
        <div className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>{description}</div>
        <div className="text-xs mt-1 font-[family-name:var(--font-mono)]" style={{ color: 'var(--text-muted)' }}>{path}</div>
      </button>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--void-border)' }}>
              {isLoading ? (
                <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>Loading...</div>
              ) : (
                <pre className="text-xs overflow-auto max-h-64 whitespace-pre-wrap" style={{ color: 'var(--text-primary)' }}>{content?.content}</pre>
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
        <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Skills Manager</h1>
        <p className="mt-1" style={{ color: 'var(--text-secondary)' }}>Browse agent skills and their definitions</p>
      </div>

      {isLoading ? (
        <div style={{ color: 'var(--text-secondary)' }}>Loading skills...</div>
      ) : !skills?.length ? (
        <div style={{ color: 'var(--text-secondary)' }}>No skills registered yet.</div>
      ) : (
        Object.entries(grouped).map(([category, catSkills]) => (
          <div key={category}>
            <h2 className="text-sm font-medium mb-3 capitalize" style={{ color: 'var(--text-secondary)' }}>{category}</h2>
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
