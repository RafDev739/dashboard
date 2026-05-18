import { getSkillById } from '@/lib/skills'
import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

export async function POST(request: NextRequest) {
  const { skillId, parameters } = await request.json()

  if (!skillId || typeof skillId !== 'string') {
    return NextResponse.json({ error: 'Missing skillId' }, { status: 400 })
  }

  const skill = getSkillById(skillId)
  if (!skill) {
    return NextResponse.json({ error: 'Skill not found' }, { status: 404 })
  }

  // Build the command with parameters
  const paramArgs = Object.entries(parameters || {})
    .map(([key, value]) => `--${key} "${String(value).replace(/"/g, '\\"')}"`)
    .join(' ')

  const command = `${skill.command} ${paramArgs}`.trim()

  try {
    const { stdout, stderr } = await execAsync(command, {
      timeout: 60000,
      env: { ...process.env },
    })
    return NextResponse.json({
      success: true,
      output: stdout,
      error: stderr || undefined,
    })
  } catch (err: unknown) {
    const error = err as { stdout?: string; stderr?: string; message?: string }
    return NextResponse.json({
      success: false,
      output: error.stdout || '',
      error: error.stderr || error.message || 'Command failed',
    })
  }
}
