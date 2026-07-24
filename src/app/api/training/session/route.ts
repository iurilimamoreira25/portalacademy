import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateCustomer } from '@/lib/customer-generator'

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    let moduleSlug: string | undefined
    try {
      const body = await req.json()
      moduleSlug = body?.moduleSlug
    } catch {
      // no body — free practice
    }

    let focusModule: { id: string; slug: string; title: string; practiceBriefing: string } | null =
      null
    if (moduleSlug) {
      const m = await prisma.module.findUnique({
        where: { slug: moduleSlug },
        select: { id: true, slug: true, title: true, practiceBriefing: true },
      })
      if (m) focusModule = m
    }

    const customer = generateCustomer()
    if (focusModule) {
      customer.focusTechnique = focusModule.title
      customer.practiceBriefing = focusModule.practiceBriefing
    }

    const session = await prisma.trainingSession.create({
      data: {
        userId: user.id,
        customerProfile: JSON.parse(JSON.stringify(customer)),
        scenario: customer.scenario,
        messages: [],
        moduleId: focusModule?.id ?? null,
      },
    })

    if (focusModule) {
      await prisma.userModuleProgress
        .upsert({
          where: { userId_moduleId: { userId: user.id, moduleId: focusModule.id } },
          create: { userId: user.id, moduleId: focusModule.id, practiceSessions: 1 },
          update: { practiceSessions: { increment: 1 } },
        })
        .catch(() => {})
    }

    return NextResponse.json({
      session,
      customer,
      focusModule: focusModule ? { slug: focusModule.slug, title: focusModule.title } : null,
    })
  } catch (error) {
    console.error('Session error:', error)
    const customer = generateCustomer()
    return NextResponse.json({
      session: { id: 'offline-' + Date.now() },
      customer,
      focusModule: null,
    })
  }
}

export async function GET() {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const sessions = await prisma.trainingSession.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 20,
    })

    return NextResponse.json({ sessions })
  } catch {
    return NextResponse.json({ sessions: [] })
  }
}
