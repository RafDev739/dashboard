import { auth } from '@/auth'
import { listEmails, type GmailCategory } from '@/lib/gmail'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const category = (searchParams.get('category') || 'new') as GmailCategory
  const maxResults = parseInt(searchParams.get('maxResults') || '100')
  const outletsParam = searchParams.get('newsOutlets')
  const newsOutlets = outletsParam ? outletsParam.split(',').filter(Boolean) : undefined

  const validCategories: GmailCategory[] = ['new', 'marketing', 'news', 'social']
  if (!validCategories.includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  try {
    const emails = await listEmails(session.accessToken, category, maxResults, newsOutlets)
    return NextResponse.json({ emails })
  } catch (err) {
    console.error('Gmail emails error:', err)
    return NextResponse.json({ error: 'Failed to fetch emails' }, { status: 500 })
  }
}
