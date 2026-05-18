'use client'

import { useState } from 'react'
import { useSettings } from '@/components/layout/SettingsProvider'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        backgroundColor: 'var(--card-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: '10px',
        overflow: 'hidden',
        marginBottom: '16px',
      }}
    >
      <div
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--card-border)',
          fontWeight: 600,
          fontSize: '0.88rem',
          color: 'var(--text-primary)',
        }}
      >
        {title}
      </div>
      <div style={{ padding: '20px' }}>{children}</div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        paddingBottom: '14px',
        marginBottom: '14px',
        borderBottom: '1px solid var(--card-border)',
      }}
    >
      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>{children}</div>
    </div>
  )
}

function OptionButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '5px 14px',
        borderRadius: '6px',
        border: active ? '1px solid var(--accent-orange)' : '1px solid var(--card-border)',
        backgroundColor: active ? 'var(--accent-orange)' : 'var(--page-bg)',
        color: active ? '#fff' : 'var(--text-secondary)',
        fontSize: '0.82rem',
        fontWeight: active ? 600 : 400,
        cursor: 'pointer',
        transition: 'all 0.12s ease',
      }}
    >
      {children}
    </button>
  )
}

export default function SettingsPage() {
  const { settings, update } = useSettings()
  const [newOutlet, setNewOutlet] = useState('')

  const addOutlet = () => {
    const domain = newOutlet.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/$/, '')
    if (!domain || settings.newsOutlets.includes(domain)) return
    update({ newsOutlets: [...settings.newsOutlets, domain] })
    setNewOutlet('')
  }

  const removeOutlet = (domain: string) => {
    update({ newsOutlets: settings.newsOutlets.filter((d) => d !== domain) })
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 720 }}>
      <h1 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '24px' }}>
        Settings
      </h1>

      {/* Appearance */}
      <Section title="Appearance">
        <Row label="Theme">
          <OptionButton active={settings.theme === 'light'} onClick={() => update({ theme: 'light' })}>
            Light
          </OptionButton>
          <OptionButton active={settings.theme === 'dark'} onClick={() => update({ theme: 'dark' })}>
            Dark
          </OptionButton>
        </Row>

        <Row label="Font size">
          <button
            onClick={() => update({ fontSize: Math.max(11, settings.fontSize - 1) })}
            style={{
              width: 28, height: 28, borderRadius: '6px',
              border: '1px solid var(--card-border)', backgroundColor: 'var(--page-bg)',
              color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem',
            }}
          >
            −
          </button>
          <span style={{ minWidth: 28, textAlign: 'center', color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
            {settings.fontSize}
          </span>
          <button
            onClick={() => update({ fontSize: Math.min(20, settings.fontSize + 1) })}
            style={{
              width: 28, height: 28, borderRadius: '6px',
              border: '1px solid var(--card-border)', backgroundColor: 'var(--page-bg)',
              color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '1rem',
            }}
          >
            +
          </button>
        </Row>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Email row density</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['compact', 'normal', 'spacious'] as const).map((d) => (
              <OptionButton key={d} active={settings.density === d} onClick={() => update({ density: d })}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </OptionButton>
            ))}
          </div>
        </div>
      </Section>

      {/* Email */}
      <Section title="Email">
        <Row label="Emails per page">
          {([50, 100, 200] as const).map((n) => (
            <OptionButton key={n} active={settings.emailsPerPage === n} onClick={() => update({ emailsPerPage: n })}>
              {n}
            </OptionButton>
          ))}
        </Row>

        <div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '10px' }}>
            News outlet domains
          </div>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              value={newOutlet}
              onChange={(e) => setNewOutlet(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addOutlet()}
              placeholder="e.g. nytimes.com"
              style={{
                flex: 1,
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--card-border)',
                backgroundColor: 'var(--page-bg)',
                color: 'var(--text-primary)',
                fontSize: '0.82rem',
                outline: 'none',
              }}
            />
            <button
              onClick={addOutlet}
              style={{
                padding: '6px 16px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'var(--accent-orange)',
                color: '#fff',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Add
            </button>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {settings.newsOutlets.map((domain) => (
              <span
                key={domain}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  backgroundColor: 'var(--badge-blue-bg)',
                  color: 'var(--badge-blue-text)',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                }}
              >
                {domain}
                <button
                  onClick={() => removeOutlet(domain)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', padding: 0, lineHeight: 1, fontSize: '0.9rem' }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>
      </Section>

      {/* Account */}
      <Section title="Account">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Sign out</span>
          <a
            href="/api/auth/signout"
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              border: '1px solid var(--card-border)',
              backgroundColor: 'var(--page-bg)',
              color: '#ef4444',
              fontSize: '0.82rem',
              fontWeight: 600,
              textDecoration: 'none',
              cursor: 'pointer',
            }}
          >
            Sign out
          </a>
        </div>
      </Section>
    </div>
  )
}
