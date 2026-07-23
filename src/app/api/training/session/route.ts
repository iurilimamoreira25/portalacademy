import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateCustomer } from '@/lib/customer-generator'

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const customer = generateCustomer()

    const session = await prisma.trainingSession.create({
      data: {
        userId: user.id,
        customerProfile: JSON.parse(JSON.stringify(customer)),
        scenario: customer.scenario,
        messages: [],
      },
    })

    return NextResponse.json({ session, customer })
  } catch (error) {
    console.error('Session error:', error)
    const customer = generateCustomer()
    return NextResponse.json({
      session: { id: 'offline-' + Date.now() },
      customer,
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
