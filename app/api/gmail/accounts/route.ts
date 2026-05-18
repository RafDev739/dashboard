import { auth } from '@/auth'
import { getEmailCounts, getUserProfile } from '@/lib/gmail'
import { NextResponse } from 'next/server'

export async function GET() {
  const session = await auth()

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  try {
    const [profile, counts] = await Promise.all([
      getUserProfile(session.accessToken),
      getEmailCounts(session.accessToken),
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
