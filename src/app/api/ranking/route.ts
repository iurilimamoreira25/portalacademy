import { NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const users = await prisma.user.findMany({
      include: { stats: true },
      orderBy: { xp: 'desc' },
      take: 50,
    })

    return NextResponse.json({ ranking: users })
  } catch {
    return NextResponse.json({ ranking: [] })
  }
}
