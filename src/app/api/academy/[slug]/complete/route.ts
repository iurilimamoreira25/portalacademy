import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const COMPLETION_XP = 40

export async function POST(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { slug } = await params
    const moduleData = await prisma.module.findUnique({ where: { slug } })
    if (!moduleData) return NextResponse.json({ error: 'Módulo não encontrado' }, { status: 404 })

    const existing = await prisma.userModuleProgress.findUnique({
      where: { userId_moduleId: { userId: user.id, moduleId: moduleData.id } },
    })

    const alreadyCompleted = !!existing?.completedAt

    await prisma.userModuleProgress.upsert({
      where: { userId_moduleId: { userId: user.id, moduleId: moduleData.id } },
      create: { userId: user.id, moduleId: moduleData.id, completedAt: new Date() },
      update: { completedAt: existing?.completedAt ?? new Date() },
    })

    // XP awarded only on first completion
    if (!alreadyCompleted) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          xp: { increment: COMPLETION_XP },
          level: { set: Math.floor((user.xp + COMPLETION_XP) / 500) + 1 },
        },
      })
    }

    return NextResponse.json({
      completed: true,
      xpEarned: alreadyCompleted ? 0 : COMPLETION_XP,
    })
  } catch (error) {
    console.error('Academy complete error:', error)
    return NextResponse.json({ error: 'Erro ao concluir módulo' }, { status: 500 })
  }
}
