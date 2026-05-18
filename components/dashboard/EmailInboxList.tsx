'use client'

interface EmailAccount {
  email: string
  counts: { new: number; marketing: number; news: number }
  isPrimary: boolean
}

interface EmailInboxListProps {
  accounts: EmailAccount[]
  loading?: boolean
}

export default function EmailInboxList({ accounts, loading }: EmailInboxListProps) {
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
        }}
      >
        <h2 style={{ color: 'var(--text-light)', fontWeight: 600, fontSize: '0.95rem' }}>
          Email Inbox
        </h2>
      </div>
      <div className="p-2">
        {loading ? (
          <div style={{ color: 'var(--text-muted)', padding: '16px', fontSize: '0.85rem' }}>
            Loading accounts...
          </div>
        ) : accounts.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', padding: '16px', fontSize: '0.85rem' }}>
            No accounts connected.{' '}
            <a href="/api/auth/signin" style={{ color: 'var(--accent-orange)' }}>
              Sign in with Google
            </a>
          </div>
        ) : (
          accounts.map((account) => (
            <div
              key={account.email}
              style={{
                padding: '12px 16px',
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}
              className="hover:bg-[#0C499C] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-orange)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#fff',
                    flexShrink: 0,
                  }}
                >
                  {account.email[0].toUpperCase()}
                </div>
                <span
                  style={{ color: 'var(--text-light)', fontSize: '0.85rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {account.email}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {account.isPrimary && (
                  <span
                    style={{
                      fontSize: '0.7rem',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--accent-orange)',
                      color: '#fff',
                    }}
                  >
                    Primary
                  </span>
                )}
                <span
                  style={{
                    fontSize: '0.75rem',
                    color: 'var(--accent-blue)',
                    fontWeight: 600,
                  }}
                >
                  {account.counts.new} new
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
