import { getAllSkills } from '@/lib/skills'
import SkillCard from '@/components/skills/SkillCard'

export default function SkillsPage() {
  const skills = getAllSkills()

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 style={{ color: 'var(--text-light)', fontWeight: 700, fontSize: '1.4rem' }}>
          Skills
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '2px' }}>
          {skills.length} skill{skills.length !== 1 ? 's' : ''} available
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {skills.map((skill) => (
          <SkillCard key={skill.id} skill={skill} />
        ))}
      </div>
    </div>
  )
}
