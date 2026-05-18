import Link from 'next/link'
import { type Skill } from '@/lib/skills'

interface AvailableSkillsListProps {
  skills: Skill[]
}

export default function AvailableSkillsList({ skills }: AvailableSkillsListProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          borderBottom: '1px solid var(--border-color)',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <h2 style={{ color: 'var(--text-light)', fontWeight: 600, fontSize: '0.95rem' }}>
          Available Skills
        </h2>
        <Link
          href="/skills"
          style={{ color: 'var(--accent-orange)', fontSize: '0.78rem' }}
          className="hover:underline"
        >
          View all
        </Link>
      </div>
      <div className="p-2">
        {skills.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', padding: '16px', fontSize: '0.85rem' }}>
            No skills configured.
          </div>
        ) : (
          skills.map((skill) => (
            <Link
              key={skill.id}
              href={`/skills/${skill.id}`}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '6px',
                textDecoration: 'none',
              }}
              className="hover:bg-[#0C499C] transition-colors group"
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '6px',
                  backgroundColor: 'var(--button-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
              <div className="min-w-0">
                <div style={{ color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: 500 }}>
                  {skill.name}
                </div>
                <div
                  style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {skill.description.slice(0, 60)}...
                </div>
              </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--text-muted)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-auto shrink-0 opacity-0 group-hover:opacity-100"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
