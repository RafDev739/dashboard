import { gmail_v1 } from '@googleapis/gmail'

export type GmailCategory = 'new' | 'marketing' | 'news' | 'social'

export interface EmailMessage {
  id: string
  threadId: string
  subject: string
  from: string
  date: string
  snippet: string
  body?: string
  isUnread: boolean
}

async function gmailFetch(accessToken: string, path: string, options?: RequestInit) {
  const base = 'https://gmail.googleapis.com/gmail/v1/users/me'
  const res = await fetch(`${base}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Gmail API error ${res.status}: ${err}`)
  }
  return res.json()
}

function decodeBase64(str: string): string {
  try {
    const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
    return Buffer.from(base64, 'base64').toString('utf-8')
  } catch {
    return ''
  }
}

function extractBody(payload: gmail_v1.Schema$MessagePart | undefined): string {
  if (!payload) return ''

  if (payload.body?.data) {
    return decodeBase64(payload.body.data)
  }

  if (payload.parts) {
    const textPart = payload.parts.find((p) => p.mimeType === 'text/plain')
    if (textPart?.body?.data) return decodeBase64(textPart.body.data)

    const htmlPart = payload.parts.find((p) => p.mimeType === 'text/html')
    if (htmlPart?.body?.data) return decodeBase64(htmlPart.body.data)

    for (const part of payload.parts) {
      const result = extractBody(part)
      if (result) return result
    }
  }

  return ''
}

function parseMessage(msg: gmail_v1.Schema$Message): EmailMessage {
  const headers = msg.payload?.headers || []
  const get = (name: string) =>
    headers.find((h) => h.name?.toLowerCase() === name.toLowerCase())?.value || ''

  return {
    id: msg.id || '',
    threadId: msg.threadId || '',
    subject: get('Subject') || '(no subject)',
    from: get('From') || '',
    date: get('Date') || '',
    snippet: msg.snippet || '',
    body: extractBody(msg.payload),
    isUnread: (msg.labelIds || []).includes('UNREAD'),
  }
}

function buildNewsQuery(outlets: string[]): string {
  if (!outlets || outlets.length === 0) return 'labelIds=CATEGORY_UPDATES'
  const q = outlets.map((d) => `from:${d}`).join(' OR ')
  return `q=${encodeURIComponent(q)}`
}

export async function getEmailCounts(
  accessToken: string
): Promise<{ new: number; marketing: number; news: number; social: number }> {
  // Labels API returns exact messagesUnread counts per category
  const [inboxLabel, promotionsLabel, updatesLabel, socialLabel] = await Promise.all([
    gmailFetch(accessToken, '/labels/INBOX').catch(() => ({ messagesUnread: 0 })),
    gmailFetch(accessToken, '/labels/CATEGORY_PROMOTIONS').catch(() => ({ messagesUnread: 0 })),
    gmailFetch(accessToken, '/labels/CATEGORY_UPDATES').catch(() => ({ messagesUnread: 0 })),
    gmailFetch(accessToken, '/labels/CATEGORY_SOCIAL').catch(() => ({ messagesUnread: 0 })),
  ])

  return {
    new: inboxLabel.messagesUnread || 0,
    marketing: promotionsLabel.messagesTotal || 0,
    news: updatesLabel.messagesTotal || 0,
    social: socialLabel.messagesTotal || 0,
  }
}

export async function listEmails(
  accessToken: string,
  category: GmailCategory,
  maxResults = 100,
  newsOutlets?: string[]
): Promise<EmailMessage[]> {
  let query: string

  if (category === 'new') {
    query = `labelIds=INBOX&labelIds=UNREAD`
  } else if (category === 'marketing') {
    query = `labelIds=CATEGORY_PROMOTIONS`
  } else if (category === 'social') {
    query = `labelIds=CATEGORY_SOCIAL`
  } else {
    // news — domain-based
    query = buildNewsQuery(newsOutlets || [])
  }

  const listData = await gmailFetch(
    accessToken,
    `/messages?${query}&maxResults=${maxResults}`
  )

  if (!listData.messages || listData.messages.length === 0) return []

  const messages = await Promise.all(
    listData.messages.map((m: { id: string }) =>
      gmailFetch(accessToken, `/messages/${m.id}?format=full`).catch(() => null)
    )
  )

  return messages.filter(Boolean).map(parseMessage)
}

export async function getEmailById(
  accessToken: string,
  id: string
): Promise<EmailMessage | null> {
  try {
    const msg = await gmailFetch(accessToken, `/messages/${id}?format=full`)
    return parseMessage(msg)
  } catch {
    return null
  }
}

export async function deleteEmail(accessToken: string, id: string): Promise<void> {
  await gmailFetch(accessToken, `/messages/${id}/trash`, { method: 'POST' })
}

export async function getUserProfile(
  accessToken: string
): Promise<{ emailAddress: string; messagesTotal: number }> {
  return gmailFetch(accessToken, '/profile')
}
