'use client'

import { type BulkRules } from '@/lib/bulkDelete'

interface RulesPanelProps {
  rules: BulkRules
  matchCount: number
  onChange: (rules: BulkRules) => void
  onApply: () => void
  onClose: () => void
}

export default function RulesPanel({ rules, matchCount, onChange, onApply, onClose }: RulesPanelProps) {
  const update = (patch: Partial<BulkRules>) => onChange({ ...rules, ...patch })

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '6px 10px',
    borderRadius: '6px',
    border: '1px solid var(--card-border)',
    backgroundColor: 'rgba(255,255,255,0.05)',
    color: 'var(--text-primary)',
    fontSize: '0.83rem',
    outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    color: 'var(--text-muted)',
    fontSize: '0.75rem',
    fontWeight: 500,
    marginBottom: 4,
    display: 'block',
  }

  return (
    <div
      style={{
        borderBottom: '1px solid var(--card-border)',
        padding: '14px 18px',
        backgroundColor: 'rgba(255,255,255,0.02)',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '12px 20px',
          marginBottom: 14,
        }}
      >
        {/* Sender */}
        <div>
          <label style={labelStyle}>From sender</label>
          <input
            type="text"
            placeholder="e.g. newsletter@example.com"
            value={rules.sender}
            onChange={(e) => update({ sender: e.target.value })}
            style={inputStyle}
          />
        </div>

        {/* Older than */}
        <div>
          <label style={labelStyle}>Older than (days)</label>
          <input
            type="number"
            placeholder="e.g. 30"
            min="1"
            value={rules.olderThanDays}
            onChange={(e) => update({ olderThanDays: e.target.value })}
            style={inputStyle}
          />
        </div>

        {/* Subject keyword */}
        <div>
          <label style={labelStyle}>Subject contains</label>
          <input
            type="text"
            placeholder="e.g. Unsubscribe"
            value={rules.subjectKeyword}
            onChange={(e) => update({ subjectKeyword: e.target.value })}
            style={inputStyle}
          />
        </div>

        {/* Unread only */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 20 }}>
          <input
            type="checkbox"
            id="rules-unread"
            checked={rules.unreadOnly}
            onChange={(e) => update({ unreadOnly: e.target.checked })}
            style={{ accentColor: 'var(--accent-orange)', cursor: 'pointer', width: 14, height: 14 }}
          />
          <label
            htmlFor="rules-unread"
            style={{ color: 'var(--text-muted)', fontSize: '0.83rem', cursor: 'pointer' }}
          >
            Unread only
          </label>
        </div>
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
          Matches <strong style={{ color: 'var(--text-primary)' }}>{matchCount}</strong> email{matchCount !== 1 ? 's' : ''}
        </span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
          >
            Close
          </button>
          <button
            onClick={onApply}
            disabled={matchCount === 0}
            style={{
              padding: '5px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: matchCount > 0 ? 'var(--accent-orange)' : 'var(--card-border)',
              color: matchCount > 0 ? '#fff' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: matchCount > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            Select {matchCount > 0 ? matchCount : ''} matching
          </button>
        </div>
      </div>
    </div>
  )
}
