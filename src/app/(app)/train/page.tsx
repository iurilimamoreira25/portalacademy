'use client'

import { useEffect, useRef, useState } from 'react'
import { useTraining } from '@/hooks/useTraining'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, ArrowRight, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { EvaluationScore, FeedbackItem } from '@/types'
import { CustomerProfile } from '@/lib/customer-generator'

const ease = [0.16, 1, 0.3, 1] as const

const moodLabels: Record<string, string> = {
  angry: 'Bravo', friendly: 'Simpático', suspicious: 'Desconfiado', curious: 'Curioso',
  indecisive: 'Indeciso', urgent: 'Urgente', researcher: 'Pesquisador',
}
const urgencyLabel: Record<string, string> = { high: 'Alta', medium: 'Média', low: 'Baixa' }

export default function TrainPage() {
  const { user, refreshUser } = useAuth()
  const training = useTraining()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (training.phase === 'idle') training.startSession()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [training.messages, training.isTyping])

  useEffect(() => {
    if (training.phase === 'feedback') refreshUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [training.phase])

  const handleSend = async () => {
    if (!input.trim() || training.isTyping || training.isLoading) return
    const msg = input.trim()
    setInput('')
    await training.sendMessage(msg)
    textareaRef.current?.focus()
  }
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  if (training.isLoading && !training.customer)
    return <CenterState title="Gerando cliente" caption="Preparando um novo perfil para você." />
  if (training.phase === 'evaluating')
    return <CenterState title="Analisando o atendimento" caption="Sua performance está sendo avaliada." />
  if (training.phase === 'feedback' && training.evaluation)
    return (
      <FeedbackView
        evaluation={training.evaluation}
        feedback={training.feedback}
        xpEarned={training.xpEarned}
        coinsEarned={training.coinsEarned}
        converted={training.converted}
        summary={training.summary}
        customer={training.customer}
        isLoading={training.isLoading}
        onNext={training.nextCustomer}
      />
    )

  const c = training.customer

  return (
    <div className="flex h-screen bg-[#f6f8fc]">
      {/* Dossier */}
      {c && (
        <aside className="hidden w-[300px] flex-shrink-0 overflow-y-auto border-r border-border bg-white md:block">
          <div className="px-6 py-7">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-2 to-brand-3 text-lg font-semibold text-white">
              {c.name.charAt(0)}
            </span>
            <h2 className="mt-4 text-[17px] font-semibold tracking-tight text-foreground">{c.name}</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">{c.city}</p>

            <span className="mt-4 inline-flex items-center rounded-full bg-brand-soft px-2.5 py-1 text-[12px] font-medium text-brand">
              {moodLabels[c.mood] ?? c.mood}
            </span>

            <dl className="mt-6">
              <Row label="Profissão" value={c.profession} />
              <Row label="Idade" value={`${c.age} anos`} />
              <Row label="Orçamento" value={`R$ ${c.budget.toLocaleString('pt-BR')}`} />
              <Row label="Urgência" value={urgencyLabel[c.urgency] ?? c.urgency} />
            </dl>

            <div className="mt-6">
              <p className="eyebrow text-[10px]">Cenário</p>
              <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">{c.scenario}</p>
            </div>

            <div className="mt-6">
              <div className="flex items-baseline justify-between">
                <p className="eyebrow text-[10px]">Interesse</p>
                <span className="tnum text-[12px] font-medium text-foreground">{c.interestLevel}/10</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                <div className="h-1.5 rounded-full bg-gradient-to-r from-brand to-brand-3 transition-all duration-500" style={{ width: `${c.interestLevel * 10}%` }} />
              </div>
            </div>
          </div>
        </aside>
      )}

      {/* Conversation */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-shrink-0 items-center justify-between border-b border-border bg-white px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-60" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-brand" />
            </span>
            <span className="text-[13px] font-medium text-muted-foreground">
              Atendimento em andamento
              {training.messages.length > 0 && <span className="ml-1.5 text-muted-foreground/60">· {Math.ceil(training.messages.length / 2)} trocas</span>}
            </span>
          </div>
          <button
            onClick={training.endSession}
            disabled={training.messages.length < 2}
            className="rounded-full px-3.5 py-2 text-[13px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
          >
            Encerrar atendimento
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-8">
          <div className="mx-auto flex min-h-full max-w-2xl flex-col justify-end space-y-4">
            {training.messages.length === 0 && (
              <div className="flex flex-1 items-center justify-center">
                <p className="max-w-xs text-center text-[13px] leading-relaxed text-muted-foreground">
                  Atendimento iniciado. Cumprimente {c?.name?.split(' ')[0]} para começar a conversa.
                </p>
              </div>
            )}
            <AnimatePresence initial={false}>
              {training.messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease }}
                  className={cn('flex', msg.role === 'user' ? 'justify-end' : 'justify-start')}
                >
                  <div
                    className={cn(
                      'max-w-[80%] px-4 py-2.5 text-[14px] leading-relaxed',
                      msg.role === 'user'
                        ? 'rounded-2xl rounded-br-md bg-primary text-white shadow-glow'
                        : 'rounded-2xl rounded-bl-md border border-border bg-white text-foreground shadow-soft'
                    )}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {training.isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-md border border-border bg-white px-4 py-3.5 shadow-soft">
                  {[0, 150, 300].map((d) => (
                    <motion.span key={d} animate={{ opacity: [0.25, 1, 0.25] }} transition={{ repeat: Infinity, duration: 1, delay: d / 1000 }} className="h-1.5 w-1.5 rounded-full bg-brand" />
                  ))}
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <div className="flex-shrink-0 border-t border-border bg-white px-6 py-4">
          <div className="mx-auto flex max-w-2xl items-end gap-3">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Responder para ${c?.name?.split(' ')[0] || 'o cliente'}…`}
              rows={1}
              disabled={training.isTyping || training.isLoading}
              className="max-h-32 min-h-[46px] flex-1 resize-none rounded-2xl border border-input bg-white px-4 py-3 text-[14px] leading-relaxed text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-brand focus:ring-4 focus:ring-brand/15"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || training.isTyping || training.isLoading}
              className="grid h-[46px] w-[46px] flex-shrink-0 place-items-center rounded-2xl bg-primary text-white shadow-glow transition-transform hover:-translate-y-px disabled:pointer-events-none disabled:opacity-30 disabled:shadow-none"
            >
              {training.isTyping ? <Loader2 className="h-[18px] w-[18px] animate-spin" /> : <Send className="h-[18px] w-[18px]" strokeWidth={2} />}
            </button>
          </div>
          <p className="mt-2.5 text-center text-[11px] text-muted-foreground">Enter envia · Shift + Enter quebra linha</p>
        </div>
      </div>
    </div>
  )
}

function CenterState({ title, caption }: { title: string; caption: string }) {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-[#f6f8fc]">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand/25 border-t-brand" />
      <p className="mt-6 text-[1.35rem] font-bold tracking-tight text-foreground">{title}</p>
      <p className="mt-2 text-[14px] text-muted-foreground">{caption}</p>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-t border-border py-2.5 first:border-t-0">
      <dt className="eyebrow text-[10px]">{label}</dt>
      <dd className="text-[13px] font-semibold text-foreground">{value}</dd>
    </div>
  )
}

function FeedbackView({
  evaluation, feedback, xpEarned, coinsEarned, converted, summary, customer, isLoading, onNext,
}: {
  evaluation: EvaluationScore; feedback: FeedbackItem[]; xpEarned: number; coinsEarned: number
  converted: boolean; summary: string; customer: CustomerProfile | null; isLoading: boolean; onNext: () => void
}) {
  const metrics = [
    { label: 'Empatia', value: evaluation.empathy },
    { label: 'Comunicação', value: evaluation.communication },
    { label: 'Escuta ativa', value: evaluation.activeListening },
    { label: 'Persuasão', value: evaluation.persuasion },
    { label: 'Conhecimento', value: evaluation.technicalKnowledge },
    { label: 'Negociação', value: evaluation.negotiation },
    { label: 'Rapidez', value: evaluation.speed },
    { label: 'Objeções', value: evaluation.objectionHandling },
    { label: 'Fechamento', value: evaluation.closure },
  ]
  const tag: Record<string, string> = { success: 'Ponto forte', error: 'A ajustar', insight: 'Sugestão' }

  return (
    <div className="h-screen overflow-y-auto bg-[#f6f8fc]">
      <div className="mx-auto max-w-3xl px-8 py-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="rounded-3xl border border-border bg-white p-8 shadow-card"
        >
          <p className="eyebrow text-brand">Atendimento concluído{customer ? ` · ${customer.name}` : ''}</p>
          <div className="mt-4 flex items-end gap-2">
            <span className="text-gradient tnum text-[4.5rem] font-extrabold leading-[0.9] tracking-tight">{evaluation.overall}</span>
            <span className="mb-3 text-[14px] font-medium text-muted-foreground">/ 100</span>
          </div>
          <div className="mt-5 h-2 w-full max-w-sm rounded-full bg-muted">
            <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: evaluation.overall / 100 }} transition={{ duration: 1, ease, delay: 0.2 }} style={{ transformOrigin: 'left' }} className="h-2 rounded-full bg-gradient-to-r from-brand to-brand-3" />
          </div>
          {summary && <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground">{summary}</p>}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-brand-soft px-3 py-1.5 text-[13px] font-semibold text-brand tnum">+{xpEarned} XP</span>
            <span className="rounded-full bg-muted px-3 py-1.5 text-[13px] font-semibold text-foreground tnum">+{coinsEarned} moedas</span>
            {converted && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1.5 text-[13px] font-semibold text-white">
                <CheckCircle2 className="h-4 w-4" strokeWidth={2} /> Venda fechada
              </span>
            )}
          </div>
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.1 }}
          className="mt-6 rounded-3xl border border-border bg-white p-8 shadow-soft"
        >
          <h2 className="text-[15px] font-semibold tracking-tight text-foreground">Competências</h2>
          <div className="mt-6 grid grid-cols-1 gap-x-10 gap-y-4 sm:grid-cols-2">
            {metrics.map((m) => (
              <div key={m.label} className="flex items-center gap-4">
                <span className="w-28 flex-shrink-0 text-[13px] text-muted-foreground">{m.label}</span>
                <div className="h-1.5 flex-1 rounded-full bg-muted">
                  <div className="h-1.5 rounded-full bg-gradient-to-r from-brand to-brand-3" style={{ width: `${m.value * 10}%` }} />
                </div>
                <span className="tnum w-5 flex-shrink-0 text-right text-[13px] font-semibold text-foreground">{m.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Feedback */}
        {feedback.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease, delay: 0.15 }}
            className="mt-6 rounded-3xl border border-border bg-white p-8 shadow-soft"
          >
            <h2 className="text-[15px] font-semibold tracking-tight text-foreground">Feedback detalhado</h2>
            <div className="mt-4">
              {feedback.map((it, i) => (
                <div key={i} className="border-t border-border py-5 first:border-t-0">
                  <span className={cn('inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide', it.type === 'success' ? 'bg-brand-soft text-brand' : 'bg-muted text-muted-foreground')}>
                    {tag[it.type] ?? 'Nota'}
                  </span>
                  <p className="mt-3 text-[14px] font-semibold text-foreground">{it.title}</p>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-muted-foreground">{it.description}</p>
                  {it.example && <p className="mt-3 rounded-xl border-l-2 border-brand bg-brand-soft/50 px-4 py-2.5 text-[13px] italic leading-relaxed text-foreground/70">“{it.example}”</p>}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <div className="mt-8 flex justify-center">
          <button
            onClick={onNext}
            disabled={isLoading}
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[15px] font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-50"
          >
            {isLoading ? (<><Loader2 className="h-[18px] w-[18px] animate-spin" /> Gerando próximo cliente…</>) : (<>Próximo cliente <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" strokeWidth={2} /></>)}
          </button>
        </div>
      </div>
    </div>
  )
}
