import { auth } from '@/auth'
import { getEmailCounts, getUserProfile } from '@/lib/gmail'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const session = await auth()

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const outletsParam = request.nextUrl.searchParams.get('newsOutlets')
  const newsOutlets = outletsParam ? outletsParam.split(',').filter(Boolean) : undefined

  try {
    const [profile, counts] = await Promise.all([
      getUserProfile(session.accessToken),
      getEmailCounts(session.accessToken, newsOutlets),
    ])

    return NextResponse.json({
      accounts: [
        {
          email: profile.emailAddress,
          counts,
          isPrimary: true,
        },
      ],
    })
  } catch (err) {
    console.error('Gmail accounts error:', err)
    return NextResponse.json({ error: 'Failed to fetch accounts' }, { status: 500 })
  }
}
