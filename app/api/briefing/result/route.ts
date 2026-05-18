import { NextResponse } from 'next/server'
import { readFileSync, existsSync } from 'fs'
import path from 'path'

const RESULT_FILE = path.join(process.cwd(), 'data', 'briefing-result.json')

export async function GET() {
  if (!existsSync(RESULT_FILE)) {
    return NextResponse.json({ status: 'idle' })
  }
  try {
    const raw = readFileSync(RESULT_FILE, 'utf-8')
    return NextResponse.json(JSON.parse(raw))
  } catch {
    return NextResponse.json({ status: 'idle' })
  }
}
