'use client'

import { useState, useEffect } from 'react'
import { type Skill } from '@/lib/skills'

interface RunSkillFormProps {
  skill: Skill
  onClose: () => void
}

export default function RunSkillForm({ skill, onClose }: RunSkillFormProps) {
  const [values, setValues] = useState<Record<string, string>>({})
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState<{ success: boolean; output: string; error?: string } | null>(null)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  // Pre-fill defaults
  useEffect(() => {
    const defaults: Record<string, string> = {}
    skill.parameters.forEach((p) => {
      if (p.default) defaults[p.name] = p.default
    })
    setValues(defaults)
  }, [skill])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setRunning(true)
    setResult(null)

    try {
      const res = await fetch('/api/skills/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ skillId: skill.id, parameters: values }),
      })
      const data = await res.json()
      setResult(data)
    } catch {
      setResult({ success: false, output: '', error: 'Network error' })
    } finally {
      setRunning(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '520px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{ borderBottom: '1px solid var(--border-color)', padding: '16px 20px' }}
          className="flex items-center justify-between shrink-0"
        >
          <div>
            <h3 style={{ color: 'var(--text-light)', fontWeight: 600, fontSize: '0.95rem' }}>
              Run: {skill.name}
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', marginTop: '2px' }}>
              Fill in the parameters below
            </p>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }} className="hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Form / Result */}
        <div className="flex-1 overflow-auto p-5">
          {result ? (
            <div>
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '6px',
                  backgroundColor: result.success ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                  border: `1px solid ${result.success ? '#22c55e' : '#ef4444'}`,
                  color: result.success ? '#4ade80' : '#f87171',
                  fontSize: '0.82rem',
                  marginBottom: '12px',
                  fontWeight: 500,
                }}
              >
                {result.success ? 'Skill executed successfully' : 'Execution failed'}
              </div>
              {result.output && (
                <pre
                  style={{
                    backgroundColor: 'var(--page-bg)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '12px',
                    color: 'var(--text-light)',
                    fontSize: '0.78rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    maxHeight: '200px',
                    overflow: 'auto',
                  }}
                >
                  {result.output}
                </pre>
              )}
              {result.error && (
                <pre
                  style={{
                    backgroundColor: 'rgba(239,68,68,0.05)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '6px',
                    padding: '12px',
                    color: '#f87171',
                    fontSize: '0.78rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    maxHeight: '150px',
                    overflow: 'auto',
                    marginTop: '8px',
                  }}
                >
                  {result.error}
                </pre>
              )}
              <button
                onClick={() => setResult(null)}
                style={{
                  marginTop: '12px',
                  color: 'var(--accent-orange)',
                  fontSize: '0.82rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                ← Run again
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {skill.parameters.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  This skill has no parameters. It will run immediately.
                </p>
              ) : (
                skill.parameters.map((param) => (
                  <div key={param.name}>
                    <label
                      style={{
                        display: 'block',
                        color: 'var(--text-light)',
                        fontSize: '0.82rem',
                        fontWeight: 500,
                        marginBottom: '6px',
                      }}
                    >
                      {param.label}
                      {param.required && (
                        <span style={{ color: 'var(--accent-orange)', marginLeft: '3px' }}>*</span>
                      )}
                    </label>

                    {param.type === 'textarea' ? (
                      <textarea
                        value={values[param.name] || ''}
                        onChange={(e) => setValues({ ...values, [param.name]: e.target.value })}
                        required={param.required}
                        placeholder={param.placeholder}
                        rows={3}
                        style={{
                          width: '100%',
                          backgroundColor: 'var(--page-bg)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          color: 'var(--text-light)',
                          fontSize: '0.85rem',
                          outline: 'none',
                          resize: 'vertical',
                        }}
                      />
                    ) : param.type === 'select' ? (
                      <select
                        value={values[param.name] || param.default || ''}
                        onChange={(e) => setValues({ ...values, [param.name]: e.target.value })}
                        required={param.required}
                        style={{
                          width: '100%',
                          backgroundColor: 'var(--page-bg)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          color: 'var(--text-light)',
                          fontSize: '0.85rem',
                          outline: 'none',
                        }}
                      >
                        {!param.required && <option value="">-- Select --</option>}
                        {param.options?.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={param.type === 'number' ? 'number' : 'text'}
                        value={values[param.name] || ''}
                        onChange={(e) => setValues({ ...values, [param.name]: e.target.value })}
                        required={param.required}
                        placeholder={param.placeholder}
                        style={{
                          width: '100%',
                          backgroundColor: 'var(--page-bg)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '6px',
                          padding: '8px 12px',
                          color: 'var(--text-light)',
                          fontSize: '0.85rem',
                          outline: 'none',
                        }}
                      />
                    )}
                  </div>
                ))
              )}

              <button
                type="submit"
                disabled={running}
                style={{
                  width: '100%',
                  backgroundColor: 'var(--accent-orange)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '10px',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  cursor: running ? 'not-allowed' : 'pointer',
                  opacity: running ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {running ? (
                  <>
                    <span
                      className="inline-block w-4 h-4 rounded-full border-2 animate-spin"
                      style={{ borderColor: '#fff', borderTopColor: 'transparent' }}
                    />
                    Running...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                    Run Skill
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
