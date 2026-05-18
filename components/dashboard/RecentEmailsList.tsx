'use client'

interface AccountCounts {
  new: number
  marketing: number
  news: number
  social: number
}

interface Account {
  email: string
  counts: AccountCounts
  isPrimary: boolean
}

interface RecentEmailsListProps {
  accounts: Account[]
  loading?: boolean
}

const AVATAR_COLORS = [
  '#E98520', '#1B99E8', '#16A34A', '#9333EA', '#DC2626',
  '#0891B2', '#D97706', '#7C3AED', '#059669', '#DB2777',
]

function getAvatarColor(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

function getInitials(email: string): string {
  const local = email.split('@')[0]
  const parts = local.split(/[._-]/).filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
  return local.slice(0, 2).toUpperCase()
}

export default function RecentEmailsList({ accounts, loading }: RecentEmailsListProps) {
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
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
            <polyline points="22,6 12,13 2,6" />
          </svg>
          <span style={{ fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>
            Email Addresses
          </span>
        </div>
        <span style={{ fontSize: '0.73rem', color: 'var(--text-muted)' }}>
          {loading ? '...' : `${accounts.length} connected`}
        </span>
      </div>

      {/* Account list */}
      <div style={{ flex: 1, overflow: 'auto' }}>
        {loading ? (
          <div style={{ padding: '16px 18px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', backgroundColor: '#E2E8F0', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ height: 12, backgroundColor: '#E2E8F0', borderRadius: 4, marginBottom: 6, width: '55%' }} />
              <div style={{ height: 10, backgroundColor: '#F1F5F9', borderRadius: 4, width: '70%' }} />
            </div>
          </div>
        ) : accounts.length === 0 ? (
          <div style={{ padding: '24px 18px', color: 'var(--text-muted)', fontSize: '0.82rem', textAlign: 'center' }}>
            No accounts connected.{' '}
            <a href="/api/auth/signin" style={{ color: 'var(--accent-orange)' }}>Sign in with Google →</a>
          </div>
        ) : (
          accounts.map((account, i) => {
            const initials = getInitials(account.email)
            const avatarColor = getAvatarColor(account.email)
            const total = account.counts.new + account.counts.marketing + account.counts.news + account.counts.social
            return (
              <div
                key={account.email}
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  borderBottom: i < accounts.length - 1 ? '1px solid var(--card-border)' : 'none',
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  backgroundColor: avatarColor,
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {initials}
                </div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    color: 'var(--text-primary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}>
                    {account.email}
                  </div>
                  <div style={{ fontSize: '0.73rem', color: 'var(--text-muted)', marginTop: '4px', display: 'flex', gap: '10px' }}>
                    <span>{account.counts.new} new</span>
                    <span>{account.counts.marketing} promo</span>
                    <span>{account.counts.news} news</span>
                    <span>{account.counts.social} social</span>
                  </div>
                </div>

                {/* Total + primary badge */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', flexShrink: 0 }}>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {total.toLocaleString()}
                  </span>
                  {account.isPrimary && (
                    <span style={{ fontSize: '0.65rem', color: 'var(--accent-blue)', fontWeight: 600 }}>
                      Primary
                    </span>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
