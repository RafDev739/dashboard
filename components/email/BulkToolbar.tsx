'use client'

import { type BulkProgress } from '@/lib/bulkDelete'

interface BulkToolbarProps {
  selectedCount: number
  totalCount: number
  progress: BulkProgress | null
  rulesOpen: boolean
  listOpen: boolean
  onSelectAll: () => void
  onClearSelection: () => void
  onDeleteSelected: () => void
  onRetryFailed: () => void
  onToggleRules: () => void
  onToggleList: () => void
}

export default function BulkToolbar({
  selectedCount,
  totalCount,
  progress,
  rulesOpen,
  listOpen,
  onSelectAll,
  onClearSelection,
  onDeleteSelected,
  onRetryFailed,
  onToggleRules,
  onToggleList,
}: BulkToolbarProps) {
  const isRunning = progress !== null && !progress.done
  const hasFailed = progress?.done && (progress.failed.length ?? 0) > 0
  const allDone = progress?.done && progress.failed.length === 0

  const allSelected = selectedCount === totalCount && totalCount > 0
  const someSelected = selectedCount > 0 && !allSelected

  return (
    <div
      style={{
        borderBottom: '1px solid var(--card-border)',
        padding: '10px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minHeight: 49,
      }}
    >
      {isRunning ? (
        /* Progress mode */
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
            Deleting {progress.deleted} of {progress.total}...
          </span>
          <div
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor: 'var(--card-border)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: '100%',
                borderRadius: 2,
                backgroundColor: 'var(--accent-orange)',
                width: `${progress.total > 0 ? (progress.deleted / progress.total) * 100 : 0}%`,
                transition: 'width 0.2s ease',
              }}
            />
          </div>
        </div>
      ) : hasFailed ? (
        /* Failure mode */
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            {progress!.deleted} deleted,{' '}
            <span style={{ color: '#f87171' }}>{progress!.failed.length} failed</span>
          </span>
          <button
            onClick={onRetryFailed}
            style={{
              padding: '5px 14px',
              borderRadius: '6px',
              border: '1px solid var(--card-border)',
              backgroundColor: 'transparent',
              color: 'var(--text-muted)',
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        </div>
      ) : allDone ? (
        /* Success mode */
        <span style={{ flex: 1, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          {progress!.deleted} email{progress!.deleted !== 1 ? 's' : ''} moved to trash
        </span>
      ) : (
        /* Selection mode */
        <>
          {/* Indeterminate/all checkbox */}
          <input
            type="checkbox"
            checked={allSelected}
            ref={(el) => {
              if (el) el.indeterminate = someSelected
            }}
            onChange={() => (allSelected ? onClearSelection() : onSelectAll())}
            style={{ accentColor: 'var(--accent-orange)', cursor: 'pointer', width: 14, height: 14 }}
          />

          <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', flex: 1 }}>
            {selectedCount} selected
          </span>

          <button
            onClick={onToggleList}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: `1px solid ${listOpen ? 'var(--accent-blue)' : 'var(--card-border)'}`,
              backgroundColor: listOpen ? 'rgba(27,153,232,0.1)' : 'transparent',
              color: listOpen ? 'var(--accent-blue)' : 'var(--text-muted)',
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            {listOpen ? 'Hide' : 'View'}
          </button>

          <button
            onClick={onToggleRules}
            style={{
              padding: '5px 12px',
              borderRadius: '6px',
              border: `1px solid ${rulesOpen ? 'var(--accent-blue)' : 'var(--card-border)'}`,
              backgroundColor: rulesOpen ? 'rgba(27,153,232,0.1)' : 'transparent',
              color: rulesOpen ? 'var(--accent-blue)' : 'var(--text-muted)',
              fontSize: '0.82rem',
              cursor: 'pointer',
            }}
          >
            Rules
          </button>

          <button
            onClick={onDeleteSelected}
            disabled={selectedCount === 0}
            style={{
              padding: '5px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: selectedCount > 0 ? 'var(--accent-orange)' : 'var(--card-border)',
              color: selectedCount > 0 ? '#fff' : 'var(--text-muted)',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: selectedCount > 0 ? 'pointer' : 'not-allowed',
            }}
          >
            Delete {selectedCount > 0 ? selectedCount : ''}
          </button>
        </>
      )}
    </div>
  )
}
