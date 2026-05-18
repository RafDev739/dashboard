'use client'

import { useEffect, useState } from 'react'
import MetricBox from '@/components/dashboard/MetricBox'
import RecentEmailsList from '@/components/dashboard/RecentEmailsList'
import DashboardSkillsList from '@/components/dashboard/DashboardSkillsList'
import { type Skill } from '@/lib/skills'

interface AccountData {
  email: string
  counts: { new: number; marketing: number; news: number; social: number }
  isPrimary: boolean
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function getHeaderDate() {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
}

export default function DashboardPage() {
  const [accounts, setAccounts] = useState<AccountData[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [loading, setLoading] = useState(true)
  const [skillsLoading, setSkillsLoading] = useState(true)
  const [unauthenticated, setUnauthenticated] = useState(false)

  useEffect(() => {
    // Fetch account counts
    fetch('/api/gmail/accounts')
      .then(async (res) => {
        if (res.status === 401) { setUnauthenticated(true); return }
        const data = await res.json()
        setAccounts(data.accounts || [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))

    // Fetch skills
    fetch('/api/skills')
      .then((res) => res.json())
      .then((data) => setSkills(data.skills || []))
      .catch(console.error)
      .finally(() => setSkillsLoading(false))
  }, [])

  const counts = accounts[0]?.counts || { new: 0, marketing: 0, news: 0, social: 0 }
  const featuredSkills = skills.filter((s) => s.featured)
  const totalEmails = counts.new + counts.marketing + counts.news

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1200 }}>

      {/* Header */}
      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0D13AB', margin: 0 }}>
            {getGreeting()} — {getHeaderDate()}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', marginTop: '4px' }}>
            {loading ? '...' : `${totalEmails} emails`} · {skillsLoading ? '...' : `${skills.length} skills ready`}
          </p>
        </div>
        {unauthenticated && (
          <a
            href="/api/auth/signin"
            style={{
              backgroundColor: 'var(--accent-orange)',
              color: '#fff',
              borderRadius: '7px',
              padding: '7px 16px',
              fontSize: '0.82rem',
              fontWeight: 600,
              textDecoration: 'none',
            }}
          >
            Connect Gmail
          </a>
        )}
      </div>

      {/* Metric boxes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '14px', marginBottom: '20px' }}>
        <MetricBox label="New emails" count={counts.new} loading={loading} />
        <MetricBox label="Marketing" count={counts.marketing} loading={loading} />
        <MetricBox label="News digests" count={counts.news} loading={loading} />
        <MetricBox label="Social Media" count={counts.social} loading={loading} />
        <MetricBox label="Skills ready" count={skillsLoading ? '—' : skills.length} accent loading={skillsLoading} />
      </div>

      {/* Two panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
        <RecentEmailsList
          accounts={accounts}
          loading={loading}
        />
        <DashboardSkillsList
          skills={featuredSkills}
          totalCount={skillsLoading ? undefined : skills.length}
        />
      </div>

      {/* Briefing viewer */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--card-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
            Briefing viewer
          </span>
          <span style={{
            fontSize: '0.7rem',
            padding: '2px 8px',
            borderRadius: '10px',
            backgroundColor: '#F1F5F9',
            color: 'var(--text-muted)',
          }}>
            Not run yet
          </span>
        </div>
        <div style={{ padding: '32px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Press &ldquo;Run morning briefing&rdquo; above or run a skill to generate your briefing
        </div>
      </div>
    </div>
  )
}
