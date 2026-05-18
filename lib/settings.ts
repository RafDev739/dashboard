import defaultOutletsData from '@/data/news-outlets.json'

export const DEFAULT_NEWS_OUTLETS: string[] = defaultOutletsData.outlets

export interface AppSettings {
  fontSize: number
  density: 'compact' | 'normal' | 'spacious'
  emailsPerPage: number
  theme: 'light' | 'dark'
  newsOutlets: string[]
}

export const DEFAULT_SETTINGS: AppSettings = {
  fontSize: 14,
  density: 'compact',
  emailsPerPage: 100,
  theme: 'light',
  newsOutlets: DEFAULT_NEWS_OUTLETS,
}

const KEY = 'dashboardSettings'

export function getSettings(): AppSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_SETTINGS
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) }
  } catch {
    return DEFAULT_SETTINGS
  }
}

export function saveSettings(settings: AppSettings): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(settings))
}

export function applySettingsToDOM(settings: AppSettings): void {
  document.documentElement.style.fontSize = settings.fontSize + 'px'
  document.documentElement.setAttribute('data-theme', settings.theme)
  document.documentElement.setAttribute('data-density', settings.density)
}
