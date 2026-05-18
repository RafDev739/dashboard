'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import RunSkillForm from '@/components/skills/RunSkillForm'
import { type Skill } from '@/lib/skills'

export default function SkillDetailPage() {
  const params = useParams()
  const id = params?.id as string

  const [skill, setSkill] = useState<Skill | null>(null)
  const [loading, setLoading] = useState(true)
  const [showRunForm, setShowRunForm] = useState(false)

  useEffect(() => {
    fetch('/api/skills')
      .then((res) => res.json())
      .then((data) => {
        const found = (data.skills as Skill[]).find((s) => s.id === id)
        setSkill(found || null)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center h-40">
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: 'var(--accent-orange)', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  if (!skill) {
    notFound()
    return null
  }

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
        <Link href="/skills" style={{ color: 'var(--accent-blue)', textDecoration: 'none' }} className="hover:underline">
          Skills
        </Link>
        <span>/</span>
        <span style={{ color: 'var(--text-light)' }}>{skill.name}</span>
      </div>

      {/* Title + Run button */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: '10px',
              backgroundColor: 'var(--button-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--accent-orange)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
          </div>
          <div>
            <h1 style={{ color: 'var(--text-light)', fontWeight: 700, fontSize: '1.3rem' }}>
              {skill.name}
            </h1>
            {skill.featured && (
              <span
                style={{
                  fontSize: '0.7rem',
                  padding: '2px 7px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--accent-orange)',
                  color: '#fff',
                  fontWeight: 600,
                  display: 'inline-block',
                  marginTop: '4px',
                }}
              >
                Featured
              </span>
            )}
          </div>
        </div>

        <button
          onClick={() => setShowRunForm(true)}
          style={{
            backgroundColor: 'var(--accent-orange)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            fontSize: '0.88rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            flexShrink: 0,
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Run Skill
        </button>
      </div>

      {/* Description */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '20px',
        }}
      >
        <h2 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
          What it does
        </h2>
        <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          {skill.description}
        </p>
      </div>

      {/* Triggers */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '10px',
          padding: '20px',
        }}
      >
        <h2 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
          Triggers
        </h2>
        <div className="flex flex-wrap gap-2">
          {skill.triggers.map((trigger) => (
            <span
              key={trigger}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                backgroundColor: 'var(--page-bg)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-light)',
                fontSize: '0.82rem',
              }}
            >
              &ldquo;{trigger}&rdquo;
            </span>
          ))}
        </div>
      </div>

      {/* Parameters preview */}
      {skill.parameters.length > 0 && (
        <div
          style={{
            backgroundColor: 'var(--card-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '10px',
            padding: '20px',
          }}
        >
          <h2 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px' }}>
            Parameters
          </h2>
          <div className="space-y-3">
            {skill.parameters.map((param) => (
              <div key={param.name} className="flex items-start gap-3">
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-orange)',
                    flexShrink: 0,
                    marginTop: '6px',
                  }}
                />
                <div>
                  <span style={{ color: 'var(--text-light)', fontSize: '0.85rem', fontWeight: 500 }}>
                    {param.label}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginLeft: '8px' }}>
                    {param.type}
                    {param.required ? ' · required' : ' · optional'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Run form modal */}
      {showRunForm && (
        <RunSkillForm skill={skill} onClose={() => setShowRunForm(false)} />
      )}
    </div>
  )
}
