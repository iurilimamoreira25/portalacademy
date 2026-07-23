import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { anthropic } from '@/lib/anthropic'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { sessionId, customerProfile, conversationHistory } = await req.json()

    if (!conversationHistory || conversationHistory.length < 2) {
      return NextResponse.json({ error: 'Conversa muito curta para avaliar' }, { status: 400 })
    }

    const conversationText = conversationHistory
      .map((m: { role: string; content: string }) =>
        `${m.role === 'user' ? 'VENDEDOR' : 'CLIENTE'}: ${m.content}`
      )
      .join('\n')

    const evaluationPrompt = `Você é um especialista em vendas avaliando o desempenho de um vendedor de vidros e esquadrias.

PERFIL DO CLIENTE SIMULADO:
- Nome: ${customerProfile.name}
- Profissão: ${customerProfile.profession}
- Humor: ${customerProfile.mood}
- Orçamento: R$ ${customerProfile.budget.toLocaleString('pt-BR')}
- Cenário: ${customerProfile.scenario}
- Probabilidade original de compra: ${Math.round(customerProfile.buyProbability * 100)}%

CONVERSA COMPLETA:
${conversationText}

Avalie o vendedor de 0 a 10 em cada critério e retorne APENAS um JSON válido no formato abaixo (sem texto adicional):
{
  "evaluation": {
    "empathy": <número 0-10>,
    "communication": <número 0-10>,
    "activeListening": <número 0-10>,
    "persuasion": <número 0-10>,
    "technicalKnowledge": <número 0-10>,
    "negotiation": <número 0-10>,
    "speed": <número 0-10>,
    "objectionHandling": <número 0-10>,
    "closure": <número 0-10>,
    "overall": <número 0-100>
  },
  "feedback": [
    {
      "type": "success",
      "title": "Ponto forte identificado",
      "description": "Descrição do que o vendedor fez bem",
      "example": "Exemplo de frase usada ou ideal"
    },
    {
      "type": "error",
      "title": "Erro identificado",
      "description": "O que o vendedor errou e por que impactou negativamente",
      "example": "Como deveria ter respondido"
    },
    {
      "type": "improvement",
      "title": "Oportunidade perdida",
      "description": "Momento em que poderia ter fechado melhor ou avançado mais",
      "example": "Frase ideal para aquele momento"
    }
  ],
  "converted": <true ou false>,
  "summary": "Resumo geral do atendimento em 2-3 frases avaliando o desempenho"
}

Seja específico, cite trechos da conversa, e dê exemplos reais de frases melhores. Avalie com rigor mas justiça.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      messages: [{ role: 'user', content: evaluationPrompt }],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    const result = JSON.parse(jsonMatch?.[0] || '{}')

    const overall = result.evaluation?.overall || 50
    const xpEarned = Math.round(overall * 1.5 + (result.converted ? 75 : 0) + conversationHistory.length * 2)
    const coinsEarned = Math.round(overall * 0.5 + (result.converted ? 30 : 0))

    if (sessionId && !sessionId.startsWith('offline-')) {
      await prisma.trainingSession
        .update({
          where: { id: sessionId },
          data: {
            evaluation: JSON.parse(JSON.stringify(result.evaluation)),
            feedback: JSON.parse(JSON.stringify(result.feedback || [])),
            xpEarned,
            coinsEarned,
            completed: true,
            completedAt: new Date(),
          },
        })
        .catch(() => {})

      await prisma.user
        .update({
          where: { id: user.id },
          data: {
            xp: { increment: xpEarned },
            coins: { increment: coinsEarned },
            level: { set: Math.floor((user.xp + xpEarned) / 500) + 1 },
          },
        })
        .catch(() => {})

      await prisma.userStats
        .upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            totalSessions: 1,
            completedSessions: 1,
            totalXP: xpEarned,
            avgScore: overall,
            avgEmpathy: result.evaluation?.empathy || 0,
            avgCommunication: result.evaluation?.communication || 0,
            avgNegotiation: result.evaluation?.negotiation || 0,
            avgClosure: result.evaluation?.closure || 0,
            conversions: result.converted ? 1 : 0,
          },
          update: {
            totalSessions: { increment: 1 },
            completedSessions: { increment: 1 },
            totalXP: { increment: xpEarned },
            conversions: { increment: result.converted ? 1 : 0 },
          },
        })
        .catch(() => {})
    }

    return NextResponse.json({
      evaluation: result.evaluation,
      feedback: result.feedback || [],
      summary: result.summary,
      converted: result.converted,
      xpEarned,
      coinsEarned,
    })
  } catch (error) {
    console.error('Evaluation error:', error)
    return NextResponse.json({ error: 'Erro ao avaliar atendimento' }, { status: 500 })
  }
}
