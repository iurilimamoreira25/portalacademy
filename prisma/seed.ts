import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + 'portal-temper-salt-2024').digest('hex')
}

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@portaltemper.com' },
    update: {},
    create: {
      email: 'admin@portaltemper.com',
      name: 'Administrador',
      role: 'ADMIN',
      passwordHash: hashPassword('admin123'),
      xp: 15000,
      level: 30,
      coins: 1500,
      streak: 15,
      stats: {
        create: {
          totalSessions: 120,
          completedSessions: 115,
          totalXP: 15000,
          avgScore: 87,
          avgEmpathy: 9,
          avgCommunication: 8.5,
          avgNegotiation: 8,
          avgClosure: 7.5,
          conversions: 78,
          trainigMinutes: 3600,
        },
      },
    },
  })

  const seller1 = await prisma.user.upsert({
    where: { email: 'joao@portaltemper.com' },
    update: {},
    create: {
      email: 'joao@portaltemper.com',
      name: 'João Vendedor',
      role: 'SELLER',
      passwordHash: hashPassword('vendedor123'),
      xp: 3200,
      level: 7,
      coins: 320,
      streak: 5,
      stats: {
        create: {
          totalSessions: 28,
          completedSessions: 26,
          totalXP: 3200,
          avgScore: 71,
          avgEmpathy: 7,
          avgCommunication: 7.5,
          avgNegotiation: 6,
          avgClosure: 6.5,
          conversions: 16,
          trainigMinutes: 840,
        },
      },
    },
  })

  const seller2 = await prisma.user.upsert({
    where: { email: 'maria@portaltemper.com' },
    update: {},
    create: {
      email: 'maria@portaltemper.com',
      name: 'Maria Silva',
      role: 'SELLER',
      passwordHash: hashPassword('vendedor123'),
      xp: 7800,
      level: 16,
      coins: 780,
      streak: 12,
      stats: {
        create: {
          totalSessions: 65,
          completedSessions: 63,
          totalXP: 7800,
          avgScore: 82,
          avgEmpathy: 8.5,
          avgCommunication: 8,
          avgNegotiation: 7.5,
          avgClosure: 7,
          conversions: 48,
          trainigMinutes: 1950,
        },
      },
    },
  })

  await prisma.product.createMany({
    skipDuplicates: true,
    data: [
      {
        name: 'Vidro Temperado 8mm',
        category: 'Vidro',
        description: 'Vidro temperado de alta resistência, 5x mais forte que vidro comum',
        features: ['Alta resistência', 'Segurança', 'Disponível em várias espessuras'],
        priceRange: 'R$ 80-150/m²',
      },
      {
        name: 'Box de Banheiro Deslizante',
        category: 'Box',
        description: 'Box de banheiro com vidro temperado 8mm, trilhos inox',
        features: ['Vidro 8mm', 'Trilho inox', 'Facilidade de limpeza'],
        priceRange: 'R$ 800-2.500',
      },
      {
        name: 'Esquadria Linha Suprema',
        category: 'Esquadria',
        description: 'Linha premium de esquadrias em alumínio de alta performance',
        features: ['Alta durabilidade', 'Vedação superior', 'Design premium'],
        priceRange: 'R$ 350-800/m²',
      },
      {
        name: 'Vidro Laminado 6+6mm',
        category: 'Vidro',
        description: 'Vidro laminado duplo, máxima segurança, não fragmenta',
        features: ['Não fragmenta', 'Segurança máxima', 'Acústico'],
        priceRange: 'R$ 120-200/m²',
      },
      {
        name: 'Espelho Bronze 4mm',
        category: 'Espelho',
        description: 'Espelho bronze com acabamento perfeito, instalação inclusa',
        features: ['Acabamento polido', 'Anti-corrosão', 'Instalação incluída'],
        priceRange: 'R$ 60-120/m²',
      },
    ],
  })

  console.log('✅ Seed concluído:')
  console.log('  Admin:', admin.email, '/ admin123')
  console.log('  Vendedor 1:', seller1.email, '/ vendedor123')
  console.log('  Vendedor 2:', seller2.email, '/ vendedor123')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
