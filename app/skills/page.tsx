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

      <div
        style={{
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        {skills.map((skill, index) => (
          <SkillCard key={skill.id} skill={skill} isLast={index === skills.length - 1} />
        ))}
      </div>
    </div>
  )
}
