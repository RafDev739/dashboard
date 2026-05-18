'use client'

interface MetricBoxProps {
  label: string
  count: number | string
  accent?: boolean
  onClick?: () => void
  active?: boolean
  loading?: boolean
}

export default function MetricBox({
  label,
  count,
  accent = false,
  onClick,
  active = false,
  loading = false,
}: MetricBoxProps) {
  const isClickable = !!onClick

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={isClickable ? (e) => e.key === 'Enter' && onClick?.() : undefined}
      style={{
        backgroundColor: active ? '#FFF3E0' : 'var(--card-bg)',
        border: `1px solid ${active ? 'var(--accent-orange)' : 'var(--card-border)'}`,
        borderRadius: '10px',
        padding: '20px 24px',
        cursor: isClickable ? 'pointer' : 'default',
        transition: 'all 0.12s ease',
        minWidth: 0,
      }}
      className={isClickable ? 'hover:border-[var(--accent-orange)] hover:bg-[#FFF8F0]' : ''}
    >
      {loading ? (
        <div
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            border: '2px solid var(--card-border)',
            borderTopColor: 'var(--accent-orange)',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      ) : (
        <div
          style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: active ? 'var(--accent-orange)' : accent ? 'var(--accent-orange)' : '#0D13AB',
            lineHeight: 1,
          }}
        >
          {count}
        </div>
      )}
      <div
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.78rem',
          marginTop: '6px',
        }}
      >
        {label}
      </div>
    </div>
  )
}
