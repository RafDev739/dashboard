'use client'

import { useEffect, useState } from 'react'
import { type EmailMessage } from '@/lib/gmail'

interface ConfirmDeleteDialogProps {
  count: number
  emails?: EmailMessage[]
  onConfirm: () => void
  onCancel: () => void
}

function getSenderName(from: string): string {
  const match = from.match(/^"?([^"<]+)"?\s*</)
  return match ? match[1].trim() : from.replace(/<[^>]+>/, '').trim() || from
}

export default function ConfirmDeleteDialog({ count, emails = [], onConfirm, onCancel }: ConfirmDeleteDialogProps) {
  const [showList, setShowList] = useState(false)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onCancel])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
      onClick={onCancel}
    >
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '12px',
          padding: '28px 32px',
          maxWidth: '480px',
          width: '100%',
          boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <p style={{ color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>
          Move to trash?
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: showList ? 12 : 24 }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
            {count === 1 ? '1 email' : `${count} emails`} will be moved to trash.
          </p>
          {emails.length > 0 && (
            <button
              onClick={() => setShowList((v) => !v)}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-blue)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                padding: '2px 0',
                flexShrink: 0,
                marginLeft: 12,
              }}
            >
              {showList ? 'Hide list' : 'Show list'}
            </button>
          )}
        </div>

        {showList && emails.length > 0 && (
          <div style={{
            border: '1px solid var(--card-border)',
            borderRadius: '8px',
            overflow: 'hidden',
            marginBottom: 20,
            maxHeight: 220,
            overflowY: 'auto',
          }}>
            {emails.map((email, i) => (
              <div
                key={email.id}
                style={{
                  padding: '8px 12px',
                  borderBottom: i < emails.length - 1 ? '1px solid var(--card-border)' : 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {getSenderName(email.from)}
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {email.subject}
                </span>
              </div>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            onClick={onCancel}
            style={{
              padding: '8px 18px',
              borderRadius: '7px',
              border: '1px solid var(--card-border)',
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              fontSize: '0.88rem',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: '8px 18px',
              borderRadius: '7px',
              border: 'none',
              backgroundColor: 'var(--accent-orange)',
              color: '#fff',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Move to trash
          </button>
        </div>
      </div>
    </div>
  )
}
