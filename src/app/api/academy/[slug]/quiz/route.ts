import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const PASS_THRESHOLD = 0.7
const QUIZ_PASS_XP = 25

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { slug } = await params
    const { answers } = await req.json() // { [questionId]: selectedIndex }

    const moduleData = await prisma.module.findUnique({
      where: { slug },
      include: { quizQuestions: { orderBy: { order: 'asc' } } },
    })
    if (!moduleData) return NextResponse.json({ error: 'Módulo não encontrado' }, { status: 404 })

    const questions = moduleData.quizQuestions
    if (questions.length === 0) {
      return NextResponse.json({ error: 'Este módulo não tem quiz' }, { status: 400 })
    }

    let correct = 0
    const results = questions.map((q) => {
      const selected = answers?.[q.id]
      const isCorrect = selected === q.correctIndex
      if (isCorrect) correct++
      return {
        questionId: q.id,
        correctIndex: q.correctIndex,
        selected: selected ?? null,
        isCorrect,
        explanation: q.explanation,
      }
    })

    const score = Math.round((correct / questions.length) * 100)
    const passed = correct / questions.length >= PASS_THRESHOLD

    const existing = await prisma.userModuleProgress.findUnique({
      where: { userId_moduleId: { userId: user.id, moduleId: moduleData.id } },
    })
    const firstPass = passed && !existing?.quizPassed

    await prisma.userModuleProgress.upsert({
      where: { userId_moduleId: { userId: user.id, moduleId: moduleData.id } },
      create: {
        userId: user.id,
        moduleId: moduleData.id,
        quizScore: score,
        quizPassed: passed,
      },
      update: {
        quizScore: Math.max(score, existing?.quizScore ?? 0),
        quizPassed: existing?.quizPassed || passed,
      },
    })

    if (firstPass) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          xp: { increment: QUIZ_PASS_XP },
          level: { set: Math.floor((user.xp + QUIZ_PASS_XP) / 500) + 1 },
        },
      })
    }

    return NextResponse.json({
      correct,
      total: questions.length,
      score,
      passed,
      results,
      xpEarned: firstPass ? QUIZ_PASS_XP : 0,
    })
  } catch (error) {
    console.error('Academy quiz error:', error)
    return NextResponse.json({ error: 'Erro ao enviar quiz' }, { status: 500 })
  }
}
