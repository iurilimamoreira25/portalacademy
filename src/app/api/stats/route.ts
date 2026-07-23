import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const [stats, recentSessions] = await Promise.all([
      prisma.userStats.findUnique({ where: { userId: user.id } }),
      prisma.trainingSession.findMany({
        where: { userId: user.id, completed: true },
        orderBy: { completedAt: 'desc' },
        take: 7,
      }),
    ])

    return NextResponse.json({ stats, recentSessions, user })
  } catch {
    return NextResponse.json({ stats: null, recentSessions: [], user: null })
  }
}
