import Link from 'next/link'
import { type Skill } from '@/lib/skills'

interface SkillCardProps {
  skill: Skill
  isLast?: boolean
}

export default function SkillCard({ skill, isLast }: SkillCardProps) {
  return (
    <Link
      href={`/skills/${skill.id}`}
      style={{
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        padding: '16px 20px',
        borderBottom: isLast ? 'none' : '1px solid var(--border-color)',
        backgroundColor: 'var(--card-bg)',
        transition: 'background-color 0.15s ease',
      }}
      className="hover:bg-[var(--button-bg)] group"
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: '8px',
          backgroundColor: 'var(--button-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          marginTop: '2px',
        }}
        className="group-hover:bg-[var(--page-bg)]"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--accent-orange)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
        </svg>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            color: 'var(--text-light)',
            fontWeight: 600,
            fontSize: '0.92rem',
            display: 'block',
            marginBottom: '4px',
          }}
        >
          {skill.name}
        </span>
        <span
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            lineHeight: 1.55,
            display: 'block',
            marginBottom: '8px',
          }}
        >
          {skill.description}
        </span>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
          {skill.triggers.slice(0, 3).map((trigger) => (
            <span
              key={trigger}
              style={{
                fontSize: '0.68rem',
                padding: '2px 7px',
                borderRadius: '4px',
                backgroundColor: 'var(--page-bg)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-color)',
              }}
            >
              {trigger}
            </span>
          ))}
          {skill.triggers.length > 3 && (
            <span style={{ fontSize: '0.68rem', padding: '2px 4px', color: 'var(--text-muted)' }}>
              +{skill.triggers.length - 3} more
            </span>
          )}
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
        style={{ flexShrink: 0, marginTop: '4px' }}
      >
        <polyline points="9 18 15 12 9 6" />
      </svg>
    </Link>
  )
}
