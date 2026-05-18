import skillsData from '@/data/skills.json'

export interface SkillParameter {
  name: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'number'
  required: boolean
  placeholder?: string
  options?: string[]
  default?: string
}

export interface Skill {
  id: string
  name: string
  icon?: string
  description: string
  triggers: string[]
  featured: boolean
  parameters: SkillParameter[]
  command: string
}

export function getAllSkills(): Skill[] {
  return skillsData.skills as Skill[]
}

export function getFeaturedSkills(): Skill[] {
  return skillsData.skills.filter((s) => s.featured) as Skill[]
}

export function getSkillById(id: string): Skill | undefined {
  return (skillsData.skills as Skill[]).find((s) => s.id === id)
}
