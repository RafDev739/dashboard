import { auth } from '@/auth'
import { getSkillById } from '@/lib/skills'
import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { writeFileSync, mkdirSync } from 'fs'
import path from 'path'

const RESULT_FILE = path.join(process.cwd(), 'data', 'briefing-result.json')

function writeResult(data: object) {
  mkdirSync(path.dirname(RESULT_FILE), { recursive: true })
  writeFileSync(RESULT_FILE, JSON.stringify(data, null, 2), 'utf-8')
}

export async function POST() {
  const session = await auth()
  if (!session?.accessToken) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const skill = getSkillById('morning-briefing')
  if (!skill) {
    return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
  }

  const timestamp = new Date().toISOString()
  writeResult({ status: 'running', timestamp, output: null, error: null })

  const command = `claude --dangerously-skip-permissions -p "/morning-briefing"`

  // Fire and forget — do not await
  exec(command, { timeout: 600000, env: { ...process.env } }, (err, stdout, stderr) => {
    if (err) {
      writeResult({
        status: 'error',
        timestamp,
        output: stdout || null,
        error: stderr || err.message || 'Command failed',
      })
    } else {
      writeResult({
        status: 'done',
        timestamp,
        output: stdout,
        error: stderr || null,
      })
    }
  })

  return NextResponse.json({ ok: true }, { status: 202 })
}
