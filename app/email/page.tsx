'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import MetricBox from '@/components/dashboard/MetricBox'
import EmailList from '@/components/email/EmailList'
import EmailModal from '@/components/email/EmailModal'
import BulkToolbar from '@/components/email/BulkToolbar'
import RulesPanel from '@/components/email/RulesPanel'
import ConfirmDeleteDialog from '@/components/email/ConfirmDeleteDialog'
import { type EmailMessage } from '@/lib/gmail'
import { applyRules, runBulkDelete, type BulkRules, type BulkProgress } from '@/lib/bulkDelete'
import { useSettings } from '@/components/layout/SettingsProvider'

type Category = 'new' | 'marketing' | 'news' | 'social' | 'personal'

interface Counts {
  new: number
  marketing: number
  news: number
  social: number
  personal: number
}

const DEFAULT_RULES: BulkRules = {
  sender: '',
  olderThanDays: '',
  unreadOnly: false,
  subjectKeyword: '',
}

export default function EmailPage() {
  const { settings } = useSettings()
  const [activeCategory, setActiveCategory] = useState<Category>('new')
  const [emails, setEmails] = useState<EmailMessage[]>([])
  const [counts, setCounts] = useState<Counts>({ new: 0, marketing: 0, news: 0, social: 0, personal: 0 })
  const [loading, setLoading] = useState(true)
  const [countsLoading, setCountsLoading] = useState(true)
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage | null>(null)
  const [unauthenticated, setUnauthenticated] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Bulk selection state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null)

  // Rules filter state
  const [rulesOpen, setRulesOpen] = useState(false)
  const [listOpen, setListOpen] = useState(false)
  const [rules, setRules] = useState<BulkRules>(DEFAULT_RULES)

  // Batch delete state
  const [confirmPending, setConfirmPending] = useState<string[] | null>(null)
  const [bulkProgress, setBulkProgress] = useState<BulkProgress | null>(null)

  // Live match count for rules panel
  const matchedIds = useMemo(() => applyRules(emails, rules), [emails, rules])

  const refreshCounts = useCallback(() => {
    const outletsParam = settings.newsOutlets.join(',')
    fetch(`/api/gmail/accounts?newsOutlets=${encodeURIComponent(outletsParam)}`)
      .then(async (res) => {
        if (res.status === 401) return
        const data = await res.json()
        const account = data.accounts?.[0]
        if (account) setCounts({ ...{ social: 0, personal: 0 }, ...account.counts })
      })
      .catch(console.error)
  }, [settings.newsOutlets])

  // Initial counts fetch
  useEffect(() => {
    setCountsLoading(true)
    const outletsParam = settings.newsOutlets.join(',')
    fetch(`/api/gmail/accounts?newsOutlets=${encodeURIComponent(outletsParam)}`)
      .then(async (res) => {
        if (res.status === 401) {
          setUnauthenticated(true)
          return
        }
        const data = await res.json()
        const account = data.accounts?.[0]
        if (account) setCounts({ ...{ social: 0, personal: 0 }, ...account.counts })
      })
      .catch(console.error)
      .finally(() => setCountsLoading(false))
  }, [settings.newsOutlets])

  // Fetch emails when category or settings change
  const fetchEmails = useCallback(async (category: Category) => {
    setLoading(true)
    setEmails([])
    try {
      const outletsParam = settings.newsOutlets.join(',')
      const newsParam = category === 'news' ? `&newsOutlets=${encodeURIComponent(outletsParam)}` : ''
      const res = await fetch(
        `/api/gmail/emails?category=${category}&maxResults=${settings.emailsPerPage}${newsParam}`
      )
      if (res.status === 401) {
        setUnauthenticated(true)
        return
      }
      const data = await res.json()
      setEmails(data.emails || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [settings.newsOutlets, settings.emailsPerPage])

  useEffect(() => {
    fetchEmails(activeCategory)
  }, [activeCategory, fetchEmails])

  // Clear selection when category changes
  useEffect(() => {
    setSelectedIds(new Set())
    setLastClickedIndex(null)
    setRulesOpen(false)
    setListOpen(false)
    setBulkProgress(null)
    setRules(DEFAULT_RULES)
  }, [activeCategory])

  // Single-email delete (existing behavior)
  const handleDelete = async (id: string) => {
    try {
      const res = await fetch('/api/gmail/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setDeleteError(data.error || `Failed to delete (${res.status})`)
        return
      }
      setEmails((prev) => prev.filter((e) => e.id !== id))
      setSelectedIds((prev) => { const next = new Set(prev); next.delete(id); return next })
      if (selectedEmail?.id === id) setSelectedEmail(null)
    } catch (err) {
      console.error('Delete failed:', err)
      setDeleteError('Network error — could not delete email')
    }
  }

  // Selection handlers
  const handleToggleSelect = useCallback((id: string, index: number, shiftHeld: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (shiftHeld && lastClickedIndex !== null) {
        const min = Math.min(lastClickedIndex, index)
        const max = Math.max(lastClickedIndex, index)
        const rangeIds = emails.slice(min, max + 1).map((e) => e.id)
        const allInRange = rangeIds.every((rid) => prev.has(rid))
        if (allInRange) {
          rangeIds.forEach((rid) => next.delete(rid))
        } else {
          rangeIds.forEach((rid) => next.add(rid))
        }
      } else {
        if (next.has(id)) next.delete(id)
        else next.add(id)
      }
      return next
    })
    setLastClickedIndex(index)
  }, [lastClickedIndex, emails])

  const handleSelectAll = useCallback(() => {
    setSelectedIds(new Set(emails.map((e) => e.id)))
  }, [emails])

  const handleClearSelection = useCallback(() => {
    setSelectedIds(new Set())
    setLastClickedIndex(null)
  }, [])

  const handleDeleteSelected = useCallback(() => {
    const ids = Array.from(selectedIds)
    if (ids.length > 0) setConfirmPending(ids)
  }, [selectedIds])

  const handleConfirmDelete = useCallback(async () => {
    const ids = confirmPending
    if (!ids) return
    setConfirmPending(null)
    setBulkProgress({ total: ids.length, deleted: 0, failed: [], done: false })

    const result = await runBulkDelete(ids, (p) => setBulkProgress({ ...p }))

    // Remove successfully deleted emails from state
    const failedSet = new Set(result.failed)
    setEmails((prev) => prev.filter((e) => failedSet.has(e.id) || !ids.includes(e.id)))
    // Keep only failed ones selected
    setSelectedIds(new Set(result.failed))
    if (result.failed.length === 0) setLastClickedIndex(null)

    // Refresh counts
    refreshCounts()

    // Auto-clear progress if no failures
    if (result.failed.length === 0) {
      setTimeout(() => setBulkProgress(null), 3000)
    }
  }, [confirmPending, refreshCounts])

  const handleRetryFailed = useCallback(() => {
    if (bulkProgress?.failed?.length) {
      setConfirmPending(bulkProgress.failed)
    }
  }, [bulkProgress])

  const categoryLabels: Record<Category, string> = {
    new: 'New Emails',
    marketing: 'Marketing',
    news: 'News & Updates',
    social: 'Social Media',
    personal: 'Personal',
  }

  const bulkActive = selectedIds.size > 0

  if (unauthenticated) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-64 gap-4">
        <p style={{ color: 'var(--text-muted)' }}>You need to connect a Gmail account.</p>
        <a
          href="/api/auth/signin"
          style={{
            backgroundColor: 'var(--accent-orange)',
            color: '#fff',
            borderRadius: '8px',
            padding: '8px 20px',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          Sign in with Google
        </a>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '1.4rem' }}>
        Email
      </h1>

      {/* Delete error banner */}
      {deleteError && (
        <div
          style={{
            backgroundColor: 'rgba(239,68,68,0.1)',
            border: '1px solid #ef4444',
            borderRadius: '8px',
            padding: '10px 16px',
            color: '#f87171',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <span>{deleteError}</span>
          <button onClick={() => setDeleteError(null)} style={{ color: '#f87171', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', lineHeight: 1 }}>×</button>
        </div>
      )}

      {/* Filter boxes */}
      <div className="grid grid-cols-5 gap-4">
        <MetricBox
          label="New Emails"
          count={counts.new}
          loading={countsLoading}
          onClick={() => setActiveCategory('new')}
          active={activeCategory === 'new'}
        />
        <MetricBox
          label="Marketing"
          count={counts.marketing}
          loading={countsLoading}
          onClick={() => setActiveCategory('marketing')}
          active={activeCategory === 'marketing'}
        />
        <MetricBox
          label="News & Updates"
          count={counts.news}
          loading={countsLoading}
          onClick={() => setActiveCategory('news')}
          active={activeCategory === 'news'}
        />
        <MetricBox
          label="Social Media"
          count={counts.social}
          loading={countsLoading}
          onClick={() => setActiveCategory('social')}
          active={activeCategory === 'social'}
        />
        <MetricBox
          label="Personal"
          count={counts.personal}
          loading={countsLoading}
          onClick={() => setActiveCategory('personal')}
          active={activeCategory === 'personal'}
        />
      </div>

      {/* Email list */}
      <div
        style={{
          backgroundColor: 'var(--card-bg)',
          border: '1px solid var(--card-border)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}
      >
        {/* Card header: bulk toolbar or normal header */}
        {bulkActive || bulkProgress !== null ? (
          <BulkToolbar
            selectedCount={selectedIds.size}
            totalCount={emails.length}
            progress={bulkProgress}
            rulesOpen={rulesOpen}
            listOpen={listOpen}
            onSelectAll={handleSelectAll}
            onClearSelection={handleClearSelection}
            onDeleteSelected={handleDeleteSelected}
            onRetryFailed={handleRetryFailed}
            onToggleRules={() => setRulesOpen((v) => !v)}
            onToggleList={() => setListOpen((v) => !v)}
          />
        ) : (
          <div
            style={{
              borderBottom: '1px solid var(--card-border)',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <h2 style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
              {categoryLabels[activeCategory]}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {!loading && emails.length > 0 && (
                <button
                  onClick={() => setRulesOpen((v) => !v)}
                  style={{
                    padding: '4px 11px',
                    borderRadius: '6px',
                    border: `1px solid ${rulesOpen ? 'var(--accent-blue)' : 'var(--card-border)'}`,
                    backgroundColor: rulesOpen ? 'rgba(27,153,232,0.1)' : 'transparent',
                    color: rulesOpen ? 'var(--accent-blue)' : 'var(--text-muted)',
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                  }}
                >
                  Filter
                </button>
              )}
              <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                {loading ? 'Loading...' : `${emails.length} emails`}
              </span>
            </div>
          </div>
        )}

        {/* Selected emails list panel */}
        {listOpen && selectedIds.size > 0 && (
          <div
            style={{
              borderBottom: '1px solid var(--card-border)',
              maxHeight: 220,
              overflowY: 'auto',
            }}
          >
            {emails
              .filter((e) => selectedIds.has(e.id))
              .map((e) => (
                <div
                  key={e.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '7px 18px',
                    borderBottom: '1px solid var(--card-border)',
                    fontSize: '0.82rem',
                  }}
                >
                  <span style={{ color: 'var(--text-primary)', fontWeight: 500, minWidth: 140, flexShrink: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.from?.split('<')[0]?.trim() || e.from || '—'}
                  </span>
                  <span style={{ color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.subject || '(no subject)'}
                  </span>
                </div>
              ))}
          </div>
        )}

        {/* Rules panel */}
        {rulesOpen && (
          <RulesPanel
            rules={rules}
            matchCount={matchedIds.length}
            onChange={setRules}
            onApply={() => {
              setSelectedIds(new Set(matchedIds))
              setLastClickedIndex(null)
            }}
            onClose={() => setRulesOpen(false)}
          />
        )}

        <EmailList
          emails={emails}
          loading={loading}
          selectedIds={selectedIds}
          bulkActive={bulkActive}
          onSelect={setSelectedEmail}
          onDelete={handleDelete}
          onToggleSelect={handleToggleSelect}
        />
      </div>

      {/* Email modal */}
      <EmailModal
        email={selectedEmail}
        onClose={() => setSelectedEmail(null)}
        onDelete={handleDelete}
      />

      {/* Confirm dialog */}
      {confirmPending !== null && (
        <ConfirmDeleteDialog
          count={confirmPending.length}
          emails={emails.filter((e) => confirmPending.includes(e.id))}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmPending(null)}
        />
      )}
    </div>
  )
}
