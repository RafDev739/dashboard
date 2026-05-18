import { auth } from '@/auth'
import { deleteEmail } from '@/lib/gmail'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const session = await auth()

  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { id } = await request.json()

  if (!id || typeof id !== 'string') {
    return NextResponse.json({ error: 'Missing email id' }, { status: 400 })
  }

  try {
    await deleteEmail(session.accessToken, id)
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Gmail delete error:', err)
    return NextResponse.json({ error: 'Failed to delete email' }, { status: 500 })
  }
}
