'use client'

import { type EmailMessage } from '@/lib/gmail'

interface EmailListProps {
  emails: EmailMessage[]
  loading?: boolean
  selectedIds: Set<string>
  bulkActive: boolean
  onSelect: (email: EmailMessage) => void
  onDelete: (id: string) => void
  onToggleSelect: (id: string, index: number, shiftHeld: boolean) => void
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' })
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }
  } catch {
    return dateStr
  }
}

function extractName(from: string): string {
  const match = from.match(/^"?([^"<]+)"?\s*</)
  return match ? match[1].trim() : from.replace(/<[^>]+>/, '').trim() || from
}

export default function EmailList({
  emails,
  loading,
  selectedIds,
  bulkActive,
  onSelect,
  onDelete,
  onToggleSelect,
}: EmailListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{ borderColor: 'var(--accent-orange)', borderTopColor: 'transparent' }}
        />
      </div>
    )
  }

  if (emails.length === 0) {
    return (
      <div
        style={{ color: 'var(--text-muted)', padding: '40px', textAlign: 'center', fontSize: '0.9rem' }}
      >
        No emails found.
      </div>
    )
  }

  return (
    <div className="divide-y" style={{ borderColor: 'var(--card-border)' }}>
      {emails.map((email, index) => {
        const isSelected = selectedIds.has(email.id)
        return (
          <div
            key={email.id}
            className="flex items-start gap-3 px-4 cursor-pointer group hover:bg-[#F8FAFC] transition-colors"
            style={{
              paddingTop: 'var(--email-row-py, 10px)',
              paddingBottom: 'var(--email-row-py, 10px)',
              backgroundColor: isSelected ? 'rgba(233,133,32,0.08)' : undefined,
            }}
            onClick={() => onSelect(email)}
          >
            {/* Checkbox */}
            <div
              className="mt-1 shrink-0"
              style={{ width: 16 }}
              onClick={(e) => {
                e.stopPropagation()
                onToggleSelect(email.id, index, e.shiftKey)
              }}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => {}}
                className={bulkActive || isSelected ? '' : 'opacity-0 group-hover:opacity-100'}
                style={{
                  accentColor: 'var(--accent-orange)',
                  cursor: 'pointer',
                  width: 14,
                  height: 14,
                  opacity: bulkActive || isSelected ? 1 : undefined,
                }}
              />
            </div>

            {/* Unread indicator */}
            <div className="mt-1.5 shrink-0">
              {email.isUnread ? (
                <div
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-orange)',
                  }}
                />
              ) : (
                <div style={{ width: 8, height: 8 }} />
              )}
            </div>

            {/* Email content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span
                  style={{
                    color: 'var(--text-light)',
                    fontWeight: email.isUnread ? 600 : 400,
                    fontSize: '0.85rem',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {extractName(email.from)}
                </span>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', flexShrink: 0 }}>
                  {formatDate(email.date)}
                </span>
              </div>
              <div
                style={{
                  color: email.isUnread ? 'var(--text-light)' : 'var(--text-muted)',
                  fontSize: '0.82rem',
                  fontWeight: email.isUnread ? 500 : 400,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {email.subject}
              </div>
              <div
                style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.78rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {email.snippet}
              </div>
            </div>

            {/* Delete button */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                onDelete(email.id)
              }}
              className="shrink-0 opacity-30 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-red-900/50"
              title="Move to trash"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
                <path d="M10 11v6" />
                <path d="M14 11v6" />
                <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
              </svg>
            </button>
          </div>
        )
      })}
    </div>
  )
}
