'use client'

import { useEffect } from 'react'

const MIN = 11
const MAX = 20
const DEFAULT = 14
const KEY = 'dashboardFontSize'

export function useFontSize() {
  const increase = () => {
    const current = parseInt(document.documentElement.style.fontSize || DEFAULT + 'px')
    const next = Math.min(current + 1, MAX)
    document.documentElement.style.fontSize = next + 'px'
    localStorage.setItem(KEY, String(next))
  }
  const decrease = () => {
    const current = parseInt(document.documentElement.style.fontSize || DEFAULT + 'px')
    const next = Math.max(current - 1, MIN)
    document.documentElement.style.fontSize = next + 'px'
    localStorage.setItem(KEY, String(next))
  }
  return { increase, decrease }
}

export default function FontSizeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const saved = localStorage.getItem(KEY)
    if (saved) {
      document.documentElement.style.fontSize = saved + 'px'
    }
  }, [])

  return <>{children}</>
}
