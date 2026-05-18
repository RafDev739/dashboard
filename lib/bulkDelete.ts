import { type EmailMessage } from '@/lib/gmail'

export interface BulkRules {
  sender: string
  olderThanDays: string
  unreadOnly: boolean
  subjectKeyword: string
}

export interface BulkProgress {
  total: number
  deleted: number
  failed: string[]
  done: boolean
}

export function applyRules(emails: EmailMessage[], rules: BulkRules): string[] {
  return emails
    .filter((email) => {
      if (rules.sender && !email.from.toLowerCase().includes(rules.sender.toLowerCase())) {
        return false
      }
      if (rules.olderThanDays) {
        const days = parseFloat(rules.olderThanDays)
        if (!isNaN(days)) {
          const ageDays = (Date.now() - new Date(email.date).getTime()) / 86400000
          if (ageDays <= days) return false
        }
      }
      if (rules.unreadOnly && !email.isUnread) {
        return false
      }
      if (
        rules.subjectKeyword &&
        !email.subject.toLowerCase().includes(rules.subjectKeyword.toLowerCase())
      ) {
        return false
      }
      return true
    })
    .map((email) => email.id)
}

const CONCURRENCY = 5

async function deleteOne(id: string): Promise<void> {
  const res = await fetch('/api/gmail/delete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  })
  if (!res.ok) throw new Error(`Failed: ${res.status}`)
}

export async function runBulkDelete(
  ids: string[],
  onProgress: (p: BulkProgress) => void
): Promise<BulkProgress> {
  let deleted = 0
  const failed: string[] = []

  for (let i = 0; i < ids.length; i += CONCURRENCY) {
    const chunk = ids.slice(i, i + CONCURRENCY)
    const results = await Promise.allSettled(chunk.map((id) => deleteOne(id)))
    results.forEach((result, idx) => {
      if (result.status === 'fulfilled') {
        deleted++
      } else {
        failed.push(chunk[idx])
      }
    })
    const progress: BulkProgress = { total: ids.length, deleted, failed, done: false }
    onProgress(progress)
  }

  const final: BulkProgress = { total: ids.length, deleted, failed, done: true }
  onProgress(final)
  return final
}
