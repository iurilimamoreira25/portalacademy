import { cookies } from 'next/headers'
import { prisma } from './prisma'
import crypto from 'crypto'

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'portal-temper-salt-2024').digest('hex')
}

export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  await prisma.session.create({
    data: { userId, token, expiresAt },
  })

  return token
}

export async function getUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('session')?.value
    if (!token) return null

    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    })

    if (!session || session.expiresAt < new Date()) return null
    return session.user
  } catch {
    return null
  }
}
