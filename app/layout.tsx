import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import Sidebar from '@/components/layout/Sidebar'
import SettingsProvider from '@/components/layout/SettingsProvider'
import BriefingProvider from '@/components/layout/BriefingProvider'

const geist = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'My Dashboard',
  description: 'Personal productivity dashboard',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={geist.variable}>
      <body className="flex min-h-screen" style={{ backgroundColor: 'var(--page-bg)' }}>
        <SettingsProvider>
          <BriefingProvider>
            <Sidebar />
            <main className="flex-1 overflow-auto min-h-screen">
              {children}
            </main>
          </BriefingProvider>
        </SettingsProvider>
      </body>
    </html>
  )
}
