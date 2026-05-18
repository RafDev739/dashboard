'use client'

import { createContext, useContext, useState, useEffect, useRef } from 'react'

interface BriefingContextValue {
  isRunning: boolean
  error: string | null
  startBriefing: () => Promise<void>
}

const BriefingContext = createContext<BriefingContextValue>({
  isRunning: false,
  error: null,
  startBriefing: async () => {},
})

export function useBriefing() {
  return useContext(BriefingContext)
}

export default function BriefingProvider({ children }: { children: React.ReactNode }) {
  const [isRunning, setIsRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(async () => {
      try {
        const res = await fetch('/api/briefing/result')
        const data = await res.json()
        if (data.status === 'done') {
          clearInterval(intervalRef.current!)
          setIsRunning(false)
          window.open('/briefing', '_blank')
        } else if (data.status === 'error') {
          clearInterval(intervalRef.current!)
          setIsRunning(false)
          setError(data.error || 'Briefing failed')
        }
      } catch {
        // keep polling on transient network errors
      }
    }, 2000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [isRunning])

  async function startBriefing() {
    setError(null)
    try {
      // Check if a completed report already exists from today
      const check = await fetch('/api/briefing/result')
      const existing = await check.json()
      if (existing.status === 'done' && existing.timestamp) {
        const briefingDate = new Date(existing.timestamp).toDateString()
        const today = new Date().toDateString()
        if (briefingDate === today) {
          window.open('/briefing', '_blank')
          return
        }
      }

      const res = await fetch('/api/briefing/run', { method: 'POST' })
      if (res.status === 202) {
        setIsRunning(true)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || `Error ${res.status}`)
      }
    } catch {
      setError('Network error — could not start briefing')
    }
  }

  return (
    <BriefingContext.Provider value={{ isRunning, error, startBriefing }}>
      {children}
    </BriefingContext.Provider>
  )
}
