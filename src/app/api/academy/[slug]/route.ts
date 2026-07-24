import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { slug } = await params

    const moduleData = await prisma.module.findUnique({
      where: { slug },
      include: {
        quizQuestions: {
          orderBy: { order: 'asc' },
          select: { id: true, order: true, question: true, options: true },
        },
      },
    })

    if (!moduleData) {
      return NextResponse.json({ error: 'Módulo não encontrado' }, { status: 404 })
    }

    const [progress, previous] = await Promise.all([
      prisma.userModuleProgress.findUnique({
        where: { userId_moduleId: { userId: user.id, moduleId: moduleData.id } },
      }),
      moduleData.order > 1
        ? prisma.module.findFirst({
            where: { order: moduleData.order - 1 },
            select: { id: true, slug: true, title: true },
          })
        : Promise.resolve(null),
    ])

    let locked = false
    if (previous) {
      const prevProgress = await prisma.userModuleProgress.findUnique({
        where: { userId_moduleId: { userId: user.id, moduleId: previous.id } },
      })
      locked = !prevProgress?.completedAt
    }

    return NextResponse.json({
      module: moduleData,
      progress: progress
        ? {
            completed: !!progress.completedAt,
            quizPassed: progress.quizPassed,
            quizScore: progress.quizScore,
            practiceSessions: progress.practiceSessions,
          }
        : null,
      locked,
      previous,
    })
  } catch (error) {
    console.error('Academy detail error:', error)
    return NextResponse.json({ error: 'Erro ao carregar módulo' }, { status: 500 })
  }
}
