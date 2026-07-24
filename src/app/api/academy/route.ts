import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const [modules, progress] = await Promise.all([
      prisma.module.findMany({
        orderBy: { order: 'asc' },
        select: {
          id: true,
          slug: true,
          order: true,
          title: true,
          summary: true,
          category: true,
          estimatedMinutes: true,
          _count: { select: { quizQuestions: true } },
        },
      }),
      prisma.userModuleProgress.findMany({ where: { userId: user.id } }),
    ])

    const progressByModule = new Map(progress.map((p) => [p.moduleId, p]))

    let previousCompleted = true
    const items = modules.map((m) => {
      const p = progressByModule.get(m.id)
      const completed = !!p?.completedAt
      const locked = !previousCompleted
      previousCompleted = completed
      return {
        ...m,
        quizCount: m._count.quizQuestions,
        completed,
        locked,
        quizPassed: p?.quizPassed ?? false,
        quizScore: p?.quizScore ?? null,
        practiceSessions: p?.practiceSessions ?? 0,
      }
    })

    const completedCount = items.filter((i) => i.completed).length

    return NextResponse.json({
      modules: items,
      completedCount,
      total: items.length,
    })
  } catch (error) {
    console.error('Academy list error:', error)
    return NextResponse.json({ modules: [], completedCount: 0, total: 0 })
  }
}
