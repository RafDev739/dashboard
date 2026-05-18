'use client'

import Link from 'next/link'
import { type Skill } from '@/lib/skills'
import { useBriefing } from '@/components/layout/BriefingProvider'

interface DashboardSkillsListProps {
  skills: Skill[]
  totalCount?: number
}

export default function DashboardSkillsList({ skills, totalCount }: DashboardSkillsListProps) {
  const { isRunning, error, startBriefing } = useBriefing()

  // Only show Morning Briefing in this panel
  const morningBriefing = skills.find((s) => s.id === 'morning-briefing')

  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '10px',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '14px 18px',
          borderBottom: '1px solid var(--card-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
            Action Skills
          </span>
        </div>
        {totalCount !== undefined && totalCount > 0 && (
          <span style={{
            backgroundColor: 'var(--badge-green-bg)',
            color: 'var(--badge-green-text)',
            fontSize: '0.7rem',
            fontWeight: 600,
            padding: '2px 8px',
            borderRadius: '10px',
          }}>
            {totalCount} ready
          </span>
        )}
      </div>

      {/* Skills list */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {error && (
          <div style={{
            padding: '8px 18px',
            backgroundColor: 'rgba(239,68,68,0.08)',
            borderBottom: '1px solid var(--card-border)',
            fontSize: '0.78rem',
            color: '#ef4444',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span>{error}</span>
            <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '1rem', lineHeight: 1 }}>×</button>
          </div>
        )}

        {!morningBriefing ? (
          <div style={{ padding: '24px 18px', color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center' }}>
            Morning Briefing skill not found.
          </div>
        ) : (
          <div
            style={{
              padding: '11px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
            className="hover:bg-[#F8FAFC]"
          >
            {/* Icon */}
            <div style={{
              width: 34,
              height: 34,
              borderRadius: '8px',
              backgroundColor: '#F1F5F9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              flexShrink: 0,
            }}>
              {morningBriefing.icon || '⚡'}
            </div>

            {/* Content */}
            <Link
              href={`/skills/${morningBriefing.id}`}
              style={{ flex: 1, minWidth: 0, textDecoration: 'none' }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.83rem', color: 'var(--text-primary)' }}>
                {morningBriefing.name}
              </div>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {morningBriefing.description.slice(0, 55)}…
              </div>
            </Link>

            {/* Run button */}
            <button
              onClick={startBriefing}
              disabled={isRunning}
              style={{
                flexShrink: 0,
                padding: '4px 10px',
                border: '1px solid var(--card-border)',
                borderRadius: '5px',
                backgroundColor: isRunning ? '#F1F5F9' : 'var(--card-bg)',
                color: isRunning ? 'var(--text-muted)' : 'var(--text-secondary)',
                fontSize: '0.73rem',
                fontWeight: 500,
                cursor: isRunning ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                transition: 'all 0.1s',
                minWidth: 54,
                justifyContent: 'center',
              }}
              className={isRunning ? '' : 'hover:border-[var(--accent-orange)] hover:text-[var(--accent-orange)]'}
            >
              {isRunning ? (
                <>
                  <svg style={{ animation: 'spin 0.8s linear infinite' }} xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M21 12a9 9 0 1 1-9-9" />
                  </svg>
                  <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
                </>
              ) : (
                <>
                  Run
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        )}

        {/* View all skills link */}
        <div style={{
          padding: '10px 18px',
          borderTop: '1px solid var(--card-border)',
          textAlign: 'center',
        }}>
          <Link
            href="/skills"
            style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textDecoration: 'none' }}
            className="hover:text-[var(--accent-blue)]"
          >
            View all {totalCount} skills →
          </Link>
        </div>
      </div>
    </div>
  )
}
