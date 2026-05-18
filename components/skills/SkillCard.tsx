import Link from 'next/link'
import { type Skill } from '@/lib/skills'

interface SkillCardProps {
  skill: Skill
}

export default function SkillCard({ skill }: SkillCardProps) {
  return (
    <Link
      href={`/skills/${skill.id}`}
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--border-color)',
        borderRadius: '10px',
        padding: '20px',
        textDecoration: 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'all 0.15s ease',
      }}
      className="hover:border-[var(--accent-orange)] hover:bg-[#0C499C] group"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '8px',
            backgroundColor: 'var(--button-bg)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
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
        {skill.featured && (
          <span
            style={{
              fontSize: '0.68rem',
              padding: '2px 7px',
              borderRadius: '4px',
              backgroundColor: 'var(--accent-orange)',
              color: '#fff',
              fontWeight: 600,
            }}
          >
            Featured
          </span>
        )}
      </div>

      <div>
        <h3
          style={{
            color: 'var(--text-light)',
            fontWeight: 600,
            fontSize: '0.95rem',
            marginBottom: '4px',
          }}
        >
          {skill.name}
        </h3>
        <p
          style={{
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            lineHeight: 1.5,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {skill.description}
        </p>
      </div>

      <div className="flex flex-wrap gap-1 mt-auto">
        {skill.triggers.slice(0, 2).map((trigger) => (
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
        {skill.triggers.length > 2 && (
          <span
            style={{
              fontSize: '0.68rem',
              padding: '2px 7px',
              borderRadius: '4px',
              color: 'var(--text-muted)',
            }}
          >
            +{skill.triggers.length - 2} more
          </span>
        )}
      </div>
    </Link>
  )
}
