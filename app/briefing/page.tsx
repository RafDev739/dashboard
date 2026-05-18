'use client'

import { useEffect, useState } from 'react'

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function inlineFormat(s: string) {
  return s
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code style="background:#F1F5F9;padding:1px 5px;border-radius:3px;font-size:0.9em">$1</code>')
}

function renderMarkdown(md: string): string {
  const lines = md.split('\n')
  const out: string[] = []
  let inList = false

  for (const raw of lines) {
    const line = raw.trimEnd()
    if (!line.trim()) {
      if (inList) { out.push('</ul>'); inList = false }
      continue
    }
    if (line.startsWith('#### ')) {
      out.push(`<h4 style="font-size:0.95rem;font-weight:700;color:#1E293B;margin:18px 0 6px">${inlineFormat(esc(line.slice(5)))}</h4>`)
    } else if (line.startsWith('### ')) {
      out.push(`<h3 style="font-size:1.05rem;font-weight:700;color:#0F172A;margin:22px 0 8px;border-bottom:1px solid #E2E8F0;padding-bottom:4px">${inlineFormat(esc(line.slice(4)))}</h3>`)
    } else if (line.startsWith('## ')) {
      out.push(`<h2 style="font-size:1.25rem;font-weight:700;color:#0F172A;margin:28px 0 10px;border-bottom:2px solid #E2E8F0;padding-bottom:6px">${inlineFormat(esc(line.slice(3)))}</h2>`)
    } else if (line.startsWith('# ')) {
      out.push(`<h1 style="font-size:1.5rem;font-weight:800;color:#0F172A;margin:0 0 12px">${inlineFormat(esc(line.slice(2)))}</h1>`)
    } else if (line.match(/^[-*] /)) {
      if (!inList) { out.push('<ul style="margin:6px 0 12px;padding-left:20px">'); inList = true }
      out.push(`<li style="margin:3px 0;color:#334155">${inlineFormat(esc(line.slice(2)))}</li>`)
    } else if (line.match(/^\d+\. /)) {
      if (!inList) { out.push('<ol style="margin:6px 0 12px;padding-left:20px">'); inList = true }
      out.push(`<li style="margin:3px 0;color:#334155">${inlineFormat(esc(line.replace(/^\d+\. /, '')))}</li>`)
    } else if (line.trim() === '---' || line.trim() === '***') {
      if (inList) { out.push('</ul>'); inList = false }
      out.push('<hr style="border:none;border-top:1px solid #E2E8F0;margin:20px 0">')
    } else {
      if (inList) { out.push('</ul>'); inList = false }
      out.push(`<p style="margin:6px 0 10px;color:#334155;line-height:1.7">${inlineFormat(esc(line))}</p>`)
    }
  }
  if (inList) out.push('</ul>')
  return out.join('\n')
}

interface BriefingResult {
  status: 'idle' | 'running' | 'done' | 'error'
  timestamp?: string
  output?: string | null
  error?: string | null
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString('en-US', {
      weekday: 'long', month: 'long', day: 'numeric',
      hour: 'numeric', minute: '2-digit',
    })
  } catch {
    return iso
  }
}

export default function BriefingPage() {
  const [result, setResult] = useState<BriefingResult>({ status: 'idle' })

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

    async function poll() {
      try {
        const res = await fetch('/api/briefing/result')
        const data: BriefingResult = await res.json()
        setResult(data)
        if (data.status === 'done' || data.status === 'error') {
          if (interval) clearInterval(interval)
        }
      } catch {
        // keep polling on network error
      }
    }

    poll()
    interval = setInterval(poll, 2000)
    return () => { if (interval) clearInterval(interval) }
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#F8FAFC',
      padding: '32px',
      fontFamily: 'system-ui, -apple-system, sans-serif',
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '1.5rem' }}>🌅</span>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
              Morning Briefing
            </h1>
          </div>
          {result.timestamp && (
            <p style={{ color: '#64748B', fontSize: '0.85rem', margin: 0 }}>
              {formatDate(result.timestamp)}
            </p>
          )}
        </div>

        {/* Content */}
        {result.status === 'idle' && (
          <div style={{
            backgroundColor: '#fff',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center',
          }}>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
              No briefing has been run yet. Click <strong>Run</strong> on the dashboard to start.
            </p>
          </div>
        )}

        {result.status === 'running' && (
          <div style={{
            backgroundColor: '#fff',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            padding: '48px',
            textAlign: 'center',
          }}>
            <div style={{
              width: 40, height: 40,
              border: '3px solid #E2E8F0',
              borderTopColor: '#E98520',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 20px',
            }} />
            <p style={{ color: '#334155', fontWeight: 600, fontSize: '1rem', margin: '0 0 6px' }}>
              Running Morning Briefing…
            </p>
            <p style={{ color: '#94A3B8', fontSize: '0.82rem', margin: 0 }}>
              This usually takes 30–90 seconds. This page updates automatically.
            </p>
            <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          </div>
        )}

        {result.status === 'done' && result.output && (
          <div style={{
            backgroundColor: '#fff',
            border: '1px solid #E2E8F0',
            borderRadius: '12px',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '14px 24px',
              borderBottom: '1px solid #E2E8F0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#16A34A' }}>
                Completed
              </span>
              <button
                onClick={() => window.close()}
                style={{
                  fontSize: '0.78rem',
                  color: '#94A3B8',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Close tab
              </button>
            </div>
            <div
              style={{ padding: '24px', fontSize: '0.9rem', lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(result.output) }}
            />
            {result.error && (
              <div style={{ padding: '12px 24px', borderTop: '1px solid #E2E8F0', backgroundColor: '#FFF7ED' }}>
                <p style={{ fontSize: '0.78rem', color: '#92400E', margin: 0 }}>
                  <strong>Warnings:</strong> {result.error}
                </p>
              </div>
            )}
          </div>
        )}

        {result.status === 'error' && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '12px',
            padding: '24px',
          }}>
            <p style={{ color: '#991B1B', fontWeight: 600, margin: '0 0 8px' }}>Briefing failed</p>
            <pre style={{
              whiteSpace: 'pre-wrap',
              fontSize: '0.82rem',
              color: '#7F1D1D',
              margin: 0,
              fontFamily: 'ui-monospace, monospace',
            }}>
              {result.error || 'Unknown error'}
            </pre>
            {result.output && (
              <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.82rem', color: '#374151', marginTop: 12, fontFamily: 'ui-monospace, monospace' }}>
                {result.output}
              </pre>
            )}
          </div>
        )}

      </div>
    </div>
  )
}
