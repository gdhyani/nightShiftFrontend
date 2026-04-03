import { useQuery } from '@tanstack/react-query'
import { apiFetch } from '@/lib/api'

interface Skill {
  path: string
  name: string
  description: string
}

interface SkillContent {
  path: string
  content: string
}

export type { Skill, SkillContent }

export function useSkills() {
  return useQuery({
    queryKey: ['skills'],
    queryFn: () => apiFetch<Skill[]>('/api/skills'),
  })
}

export function useSkillContent(path: string) {
  return useQuery({
    queryKey: ['skill', path],
    queryFn: () => apiFetch<SkillContent>(`/api/skills/${path}`),
    enabled: !!path,
  })
}
