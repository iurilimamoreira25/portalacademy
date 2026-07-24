import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    if (user.role !== 'ADMIN' && user.role !== 'SUPERVISOR') {
      return NextResponse.json({ error: 'Acesso restrito' }, { status: 403 })
    }

    const [totalModules, sellers] = await Promise.all([
      prisma.module.count(),
      prisma.user.findMany({
        where: { role: 'SELLER' },
        select: {
          id: true,
          name: true,
          email: true,
          level: true,
          moduleProgress: {
            select: {
              completedAt: true,
              quizScore: true,
              quizPassed: true,
              practiceSessions: true,
            },
          },
        },
      }),
    ])

    const team = sellers.map((s) => {
      const completed = s.moduleProgress.filter((p) => p.completedAt).length
      const quizScores = s.moduleProgress
        .map((p) => p.quizScore)
        .filter((v): v is number => v !== null)
      const avgQuiz =
        quizScores.length > 0
          ? Math.round(quizScores.reduce((a, b) => a + b, 0) / quizScores.length)
          : null
      const practiceTotal = s.moduleProgress.reduce((a, p) => a + p.practiceSessions, 0)

      return {
        id: s.id,
        name: s.name,
        email: s.email,
        level: s.level,
        completed,
        totalModules,
        completionRate: totalModules > 0 ? Math.round((completed / totalModules) * 100) : 0,
        avgQuiz,
        practiceTotal,
      }
    })

    team.sort((a, b) => b.completionRate - a.completionRate)

    return NextResponse.json({ team, totalModules })
  } catch (error) {
    console.error('Academy team error:', error)
    return NextResponse.json({ team: [], totalModules: 0 })
  }
}
