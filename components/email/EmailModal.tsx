'use client'

import { type EmailMessage } from '@/lib/gmail'
import { useEffect } from 'react'

interface EmailModalProps {
  email: EmailMessage | null
  onClose: () => void
  onDelete: (id: string) => void
}

function isHtml(str: string) {
  return /<[a-z][\s\S]*>/i.test(str)
}

export default function EmailModal({ email, onClose, onDelete }: EmailModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!email) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-end"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
      onClick={onClose}
    >
      <div
        className="h-full w-full max-w-2xl flex flex-col overflow-hidden"
        style={{
          backgroundColor: 'var(--card-bg)',
          borderLeft: '1px solid var(--card-border)',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.08)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{ borderBottom: '1px solid var(--card-border)', padding: '16px 20px' }}
          className="flex items-center justify-between gap-4 shrink-0"
        >
          <button
            onClick={onClose}
            style={{ color: 'var(--text-muted)' }}
            className="hover:text-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <h2
            style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.9rem', flex: 1 }}
            className="line-clamp-1"
          >
            {email.subject}
          </h2>
          <button
            onClick={() => {
              onDelete(email.id)
              onClose()
            }}
            style={{
              backgroundColor: 'var(--button-bg)',
              color: '#ef4444',
              border: '1px solid var(--border-color)',
              borderRadius: '6px',
              padding: '5px 12px',
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
            </svg>
            Trash
          </button>
        </div>

        {/* Meta */}
        <div
          style={{ borderBottom: '1px solid var(--card-border)', padding: '12px 20px' }}
          className="shrink-0 space-y-1"
        >
          <div style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>
            <span style={{ color: 'var(--text-muted)' }}>From: </span>
            {email.from}
          </div>
          <div style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
            {email.date}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-auto p-6">
          {email.body ? (
            isHtml(email.body) ? (
              <iframe
                srcDoc={email.body}
                className="w-full h-full border-0"
                sandbox="allow-same-origin"
                title="Email content"
                style={{ minHeight: '400px', backgroundColor: '#fff', borderRadius: '6px' }}
              />
            ) : (
              <pre
                style={{
                  color: 'var(--text-light)',
                  fontSize: '0.85rem',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  lineHeight: 1.6,
                }}
              >
                {email.body}
              </pre>
            )
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              {email.snippet}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
