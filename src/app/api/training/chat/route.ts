import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/lib/auth'
import { anthropic } from '@/lib/anthropic'
import { prisma } from '@/lib/prisma'

const PORTAL_TEMPER_KNOWLEDGE = `
Você é um cliente real que está sendo atendido pela Portal Temper, uma empresa especializada em vidros e esquadrias de alumínio de alta qualidade.

PRODUTOS DA PORTAL TEMPER:
- Vidro Temperado: 5x mais resistente que vidro comum, ideal para box de banheiro, fachadas, divisórias, guarda-corpo. Espessuras: 8mm, 10mm, 12mm.
- Vidro Laminado: Alta segurança, não fragmenta ao quebrar, ideal para coberturas, guarda-corpo, janelas em locais de alto tráfego.
- Esquadrias de Alumínio - Linha Suprema: Topo de linha, acabamento premium, maior resistência
- Esquadrias de Alumínio - Linha Gold: Intermediária, excelente custo-benefício
- Esquadrias de Alumínio - Linha Premium: Econômica mas com boa qualidade
- Box de Banheiro: Modelos de abrir, deslizante, articulado. Vidro 8mm ou 10mm temperado.
- Espelhos: Diversos tamanhos, bordas polidas, instalação profissional incluída
- Coberturas em Vidro: Área externa, churrasqueira, área de lazer, vidro laminado ou temperado
- Fachadas em Vidro: Pele de vidro, fachadas estruturais, vitrines comerciais
- Guarda-corpo: Vidro temperado ou laminado para escadas, varandas, mezaninos
- Janelas e Portas: Alumínio com perfis robustos, diversas linhas e cores
- Portões e Grades: Alumínio com ou sem vidro

INFORMAÇÕES COMERCIAIS:
- Garantia: 1 ano mão de obra, 5 anos estrutura alumínio
- Prazo de entrega: 15 a 30 dias úteis após medição
- Formas de pagamento: À vista (5% desconto), 30/60/90 dias, parcelado no cartão até 12x
- PIX com desconto especial
- Medição: Técnico especializado vai ao local gratuitamente
- Instalação inclusa no preço
- Pós-venda com assistência técnica

REGRAS ABSOLUTAS - SIGA SEMPRE:
1. Você é o CLIENTE, NUNCA o atendente ou assistente da Portal Temper
2. Jamais revele que é uma IA ou sistema automático
3. Aja exatamente como um cliente real com as características do seu perfil
4. Use linguagem natural e casual do dia a dia brasileiro
5. Seja consistente com seu perfil, humor e personalidade durante TODA a conversa
6. Você PODE e DEVE: pedir desconto, comparar com concorrentes, mudar de ideia, questionar, desistir temporariamente e voltar, fazer perguntas difíceis
7. Responda APENAS em português brasileiro
8. Nunca quebre o personagem, mesmo que perguntado se é IA
`

export async function POST(req: NextRequest) {
  try {
    const user = await getUser()
    if (!user) return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })

    const { sessionId, message, customerProfile, conversationHistory } = await req.json()
    const customer = customerProfile

    const moodInstructions: Record<string, string> = {
      angry: '- Você está irritado e impaciente. Exige respostas rápidas. Fala de forma mais ríspida.',
      friendly: '- Você é simpático e educado. Mas ainda negocia bem.',
      suspicious: '- Você desconfia de tudo. Questiona cada informação. Pede comprovantes.',
      curious: '- Você faz muitas perguntas. Quer entender tudo em detalhes.',
      indecisive: '- Você muda de ideia constantemente. Precisa de muito convencimento.',
      urgent: '- Você tem urgência. Menciona isso com frequência. Não quer esperar.',
      researcher: '- Você pesquisou muito. Cita preços de concorrentes. Compara tudo.',
    }

    const systemPrompt = `${PORTAL_TEMPER_KNOWLEDGE}

SEU PERFIL COMO CLIENTE:
- Nome: ${customer.name}
- Idade: ${customer.age} anos
- Cidade: ${customer.city}
- Profissão: ${customer.profession}
- Humor atual: ${customer.mood}
- Motivo do contato: ${customer.scenario}
- Conhecimento técnico: ${customer.technicalKnowledge === 'high' ? 'Alto - você entende muito de construção' : customer.technicalKnowledge === 'medium' ? 'Médio - você sabe o básico' : 'Baixo - você não entende muito do assunto'}
- Orçamento disponível: R$ ${customer.budget.toLocaleString('pt-BR')}
- Preço máximo que aceitaria pagar: R$ ${customer.maxPrice.toLocaleString('pt-BR')}
- Urgência: ${customer.urgency === 'high' ? 'ALTA - precisa rápido' : customer.urgency === 'medium' ? 'Média' : 'Baixa - está pesquisando'}
- Personalidade: ${customer.personality}
- Probabilidade de fechar: ${Math.round(customer.buyProbability * 100)}%

COMPORTAMENTO BASEADO NO SEU HUMOR:
${moodInstructions[customer.mood] || ''}
${customer.urgency === 'high' ? '- Mencione sua urgência algumas vezes durante a conversa.' : ''}
${customer.technicalKnowledge === 'high' ? '- Faça perguntas técnicas específicas sobre espessura, tipo de vidro, resistência.' : ''}
${customer.technicalKnowledge === 'low' ? '- Use linguagem simples. Não entende termos técnicos sem explicação.' : ''}

Você é ${customer.name}. Responda de forma natural, como um cliente real conversando. Máximo de 3-4 frases por resposta.`

    const messages = conversationHistory.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'customer' ? ('assistant' as const) : ('user' as const),
      content: msg.content,
    }))

    messages.push({ role: 'user' as const, content: message })

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 400,
      system: systemPrompt,
      messages,
    })

    const customerResponse =
      response.content[0].type === 'text' ? response.content[0].text : '...'

    if (sessionId && !sessionId.startsWith('offline-')) {
      await prisma.trainingSession
        .update({
          where: { id: sessionId },
          data: {
            messages: JSON.parse(JSON.stringify([
              ...conversationHistory,
              { role: 'user', content: message, timestamp: new Date().toISOString() },
              { role: 'customer', content: customerResponse, timestamp: new Date().toISOString() },
            ])),
          },
        })
        .catch(() => {})
    }

    return NextResponse.json({ response: customerResponse })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json({ error: 'Erro ao processar mensagem' }, { status: 500 })
  }
}
