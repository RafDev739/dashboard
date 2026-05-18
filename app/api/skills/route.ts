import { getAllSkills } from '@/lib/skills'
import { NextResponse } from 'next/server'

export async function GET() {
  const skills = getAllSkills()
  return NextResponse.json({ skills })
}
