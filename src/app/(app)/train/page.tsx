'use client'

import { useEffect, useRef, useState } from 'react'
import { useTraining } from '@/hooks/useTraining'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Send,
  Loader2,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Zap,
  ArrowRight,
  RefreshCw,
  PhoneOff,
  MapPin,
  Briefcase,
  DollarSign,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { EvaluationScore, FeedbackItem } from '@/types'
import { CustomerProfile } from '@/lib/customer-generator'

const moodConfig: Record<string, { label: string; color: string }> = {
  angry: { label: 'Bravo', color: 'text-red-400 bg-red-500/15 border-red-500/20' },
  friendly: { label: 'Simpático', color: 'text-emerald-400 bg-emerald-500/15 border-emerald-500/20' },
  suspicious: { label: 'Desconfiado', color: 'text-orange-400 bg-orange-500/15 border-orange-500/20' },
  curious: { label: 'Curioso', color: 'text-blue-400 bg-blue-500/15 border-blue-500/20' },
  indecisive: { label: 'Indeciso', color: 'text-yellow-400 bg-yellow-500/15 border-yellow-500/20' },
  urgent: { label: 'Urgente', color: 'text-pink-400 bg-pink-500/15 border-pink-500/20' },
  researcher: { label: 'Pesquisador', color: 'text-violet-400 bg-violet-500/15 border-violet-500/20' },
}

export default function TrainPage() {
  const { user, refreshUser } = useAuth()
  const training = useTraining()
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [input, setInput] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (training.phase === 'idle') {
      training.startSession()
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [training.messages, training.isTyping])

  useEffect(() => {
    if (training.phase === 'feedback') {
      refreshUser()
    }
  }, [training.phase])

  const handleSend = async () => {
    if (!input.trim() || training.isTyping || training.isLoading) return
    const msg = input.trim()
    setInput('')
    await training.sendMessage(msg)
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  if (training.isLoading && !training.customer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808]">
        <div className="text-center">
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg shadow-blue-500/20"
          >
            <Zap className="w-8 h-8 text-white" />
          </motion.div>
          <p className="text-white/50 text-sm">Gerando cliente...</p>
        </div>
      </div>
    )
  }

  if (training.phase === 'evaluating') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#080808]">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 relative">
            <div className="w-20 h-20 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Zap className="w-7 h-7 text-blue-400" />
            </div>
          </div>
          <h2 className="text-white text-xl font-bold mb-2">Analisando atendimento...</h2>
          <p className="text-white/30 text-sm">A IA está avaliando sua performance</p>
        </div>
      </div>
    )
  }

  if (training.phase === 'feedback' && training.evaluation) {
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
  }

  return (
    <div className="h-screen flex bg-[#080808]">
      {training.customer && (
        <aside className="w-68 border-r border-white/[0.06] bg-[#0d0d0d] flex-shrink-0 overflow-y-auto">
          <div className="p-5">
            <div className="mb-5">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-lg font-bold mb-3 shadow-md">
                {training.customer.name.charAt(0)}
              </div>
              <h2 className="text-white font-bold text-base">{training.customer.name}</h2>
              <div className="flex items-center gap-1.5 mt-1">
                <MapPin className="w-3 h-3 text-white/25" />
                <span className="text-white/35 text-xs">{training.customer.city}</span>
              </div>
            </div>

            <div className="space-y-2.5 mb-4">
              <InfoRow icon={Briefcase} label="Profissão" value={training.customer.profession} />
              <InfoRow icon={MessageSquare} label="Idade" value={`${training.customer.age} anos`} />
              <InfoRow
                icon={DollarSign}
                label="Orçamento"
                value={`R$ ${training.customer.budget.toLocaleString('pt-BR')}`}
              />
              <InfoRow
                icon={AlertTriangle}
                label="Urgência"
                value={
                  training.customer.urgency === 'high'
                    ? 'Alta'
                    : training.customer.urgency === 'medium'
                      ? 'Média'
                      : 'Baixa'
                }
                valueClass={
                  training.customer.urgency === 'high'
                    ? 'text-red-400'
                    : training.customer.urgency === 'medium'
                      ? 'text-yellow-400'
                      : 'text-emerald-400'
                }
              />
            </div>

            <div className="mb-4">
              {moodConfig[training.customer.mood] && (
                <span
                  className={cn(
                    'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border',
                    moodConfig[training.customer.mood].color
                  )}
                >
                  {moodConfig[training.customer.mood].label}
                </span>
              )}
            </div>

            <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3 mb-4">
              <p className="text-white/25 text-[10px] uppercase tracking-wider mb-2">Cenário</p>
              <p className="text-white/55 text-xs leading-relaxed">{training.customer.scenario}</p>
            </div>

            <div>
              <p className="text-white/25 text-[10px] uppercase tracking-wider mb-2">Interesse</p>
              <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all"
                  style={{ width: `${training.customer.interestLevel * 10}%` }}
                />
              </div>
              <p className="text-white/25 text-[10px] mt-1">{training.customer.interestLevel}/10</p>
            </div>
          </div>
        </aside>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <div className="border-b border-white/[0.06] px-6 py-3 flex items-center justify-between bg-[#0d0d0d]/50 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/40 text-sm">
              Simulação em andamento
              {training.messages.length > 0 && (
                <span className="ml-2 text-white/20">
                  · {Math.ceil(training.messages.length / 2)} trocas
                </span>
              )}
            </span>
          </div>
          <Button
            onClick={training.endSession}
            disabled={training.messages.length < 2}
            variant="outline"
            size="sm"
            className="border-red-500/20 text-red-400/70 hover:text-red-400 hover:bg-red-500/8 hover:border-red-500/30 gap-2 text-xs"
          >
            <PhoneOff className="w-3.5 h-3.5" />
            Encerrar atendimento
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {training.messages.length === 0 && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-white/25 max-w-sm">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-7 h-7 opacity-40" />
                </div>
                <p className="font-medium mb-1">Atendimento iniciado</p>
                <p className="text-sm text-white/15">
                  Diga olá para {training.customer?.name?.split(' ')[0]} ou aguarde a primeira mensagem do cliente.
                </p>
              </div>
            </div>
          )}

          <AnimatePresence initial={false}>
            {training.messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('flex items-end gap-2', msg.role === 'user' ? 'justify-end' : 'justify-start')}
              >
                {msg.role === 'customer' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-0.5">
                    {training.customer?.name.charAt(0)}
                  </div>
                )}
                <div
                  className={cn(
                    'max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                    msg.role === 'user'
                      ? 'bg-blue-600 text-white rounded-br-sm shadow-md shadow-blue-500/10'
                      : 'bg-white/[0.07] text-white/85 rounded-bl-sm border border-white/[0.06]'
                  )}
                >
                  {msg.content}
                </div>
                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-0.5">
                    {user?.name?.charAt(0) || 'V'}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {training.isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-end gap-2"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {training.customer?.name.charAt(0)}
              </div>
              <div className="bg-white/[0.07] border border-white/[0.06] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1">
                {[0, 150, 300].map((delay) => (
                  <motion.span
                    key={delay}
                    animate={{ y: [-2, 2, -2] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: delay / 1000 }}
                    className="w-1.5 h-1.5 rounded-full bg-white/40"
                  />
                ))}
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-white/[0.06] p-4 bg-[#0d0d0d]/30 flex-shrink-0">
          <div className="flex gap-3 items-end">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Responder para ${training.customer?.name?.split(' ')[0] || 'o cliente'}...`}
              className="flex-1 min-h-[44px] max-h-28 resize-none bg-white/[0.04] border-white/10 text-white placeholder:text-white/20 focus:border-blue-500/40 focus:ring-0 text-sm leading-relaxed"
              rows={1}
              disabled={training.isTyping || training.isLoading}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || training.isTyping || training.isLoading}
              size="icon"
              className="bg-blue-600 hover:bg-blue-500 h-11 w-11 flex-shrink-0 shadow-md shadow-blue-500/15 transition-all"
            >
              {training.isTyping ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-white/15 text-xs mt-2 text-center">Enter para enviar · Shift+Enter nova linha</p>
        </div>
      </div>
    </div>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
  valueClass?: string
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/30 text-xs flex items-center gap-1.5">
        <Icon className="w-3 h-3" />
        {label}
      </span>
      <span className={cn('text-xs font-medium', valueClass || 'text-white/60')}>{value}</span>
    </div>
  )
}

function FeedbackView({
  evaluation,
  feedback,
  xpEarned,
  coinsEarned,
  converted,
  summary,
  customer,
  isLoading,
  onNext,
}: {
  evaluation: EvaluationScore
  feedback: FeedbackItem[]
  xpEarned: number
  coinsEarned: number
  converted: boolean
  summary: string
  customer: CustomerProfile | null
  isLoading: boolean
  onNext: () => void
}) {
  const metrics = [
    { label: 'Empatia', value: evaluation.empathy },
    { label: 'Comunicação', value: evaluation.communication },
    { label: 'Escuta Ativa', value: evaluation.activeListening },
    { label: 'Persuasão', value: evaluation.persuasion },
    { label: 'Conhecimento', value: evaluation.technicalKnowledge },
    { label: 'Negociação', value: evaluation.negotiation },
    { label: 'Rapidez', value: evaluation.speed },
    { label: 'Objeções', value: evaluation.objectionHandling },
    { label: 'Fechamento', value: evaluation.closure },
  ]

  const overallColor =
    evaluation.overall >= 75
      ? 'text-emerald-400'
      : evaluation.overall >= 50
        ? 'text-yellow-400'
        : 'text-red-400'

  return (
    <div className="min-h-screen p-8 overflow-y-auto bg-[#080808]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-10"
        >
          <div
            className={cn(
              'inline-flex items-center justify-center w-24 h-24 rounded-full border-4 mb-5',
              evaluation.overall >= 75
                ? 'border-emerald-500/30 bg-emerald-500/10'
                : evaluation.overall >= 50
                  ? 'border-yellow-500/30 bg-yellow-500/10'
                  : 'border-red-500/30 bg-red-500/10'
            )}
          >
            <span className={cn('text-3xl font-bold', overallColor)}>{evaluation.overall}</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Atendimento Concluído</h1>
          {summary && <p className="text-white/40 text-sm max-w-xl mx-auto mb-5 leading-relaxed">{summary}</p>}

          <div className="flex items-center justify-center gap-5">
            <div className="flex items-center gap-2 text-yellow-400 bg-yellow-400/10 border border-yellow-400/20 px-4 py-2 rounded-full">
              <Star className="w-4 h-4" />
              <span className="font-bold">+{xpEarned} XP</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400 bg-amber-400/10 border border-amber-400/20 px-4 py-2 rounded-full">
              <Zap className="w-4 h-4" />
              <span className="font-bold">+{coinsEarned} moedas</span>
            </div>
            {converted && (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4" />
                <span className="font-bold">Venda fechada!</span>
              </div>
            )}
          </div>
        </motion.div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4"
            >
              <p className="text-white/35 text-xs mb-2.5">{m.label}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      m.value >= 7 ? 'bg-emerald-500' : m.value >= 5 ? 'bg-yellow-500' : 'bg-red-500'
                    )}
                    style={{ width: `${m.value * 10}%` }}
                  />
                </div>
                <span
                  className={cn(
                    'font-bold text-sm w-5 text-right',
                    m.value >= 7
                      ? 'text-emerald-400'
                      : m.value >= 5
                        ? 'text-yellow-400'
                        : 'text-red-400'
                  )}
                >
                  {m.value}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {feedback.length > 0 && (
          <div className="mb-10">
            <h2 className="text-white font-bold text-lg mb-4">Feedback Detalhado</h2>
            <div className="space-y-3">
              {feedback.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className={cn(
                    'p-4 rounded-xl border',
                    item.type === 'success'
                      ? 'bg-emerald-500/8 border-emerald-500/20'
                      : item.type === 'error'
                        ? 'bg-red-500/8 border-red-500/20'
                        : 'bg-blue-500/8 border-blue-500/20'
                  )}
                >
                  <div className="flex items-start gap-3">
                    {item.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : item.type === 'error' ? (
                      <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm mb-1">{item.title}</p>
                      <p className="text-white/50 text-sm leading-relaxed">{item.description}</p>
                      {item.example && (
                        <p className="mt-2.5 text-xs bg-white/[0.04] border border-white/[0.06] rounded-lg px-3 py-2 text-white/60 italic leading-relaxed">
                          &quot;{item.example}&quot;
                        </p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center pb-8"
        >
          <Button
            onClick={onNext}
            disabled={isLoading}
            className="bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white font-bold px-10 py-3 h-auto gap-3 text-base shadow-lg shadow-blue-500/20 transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Gerando próximo cliente...
              </>
            ) : (
              <>
                <RefreshCw className="w-5 h-5" />
                Próximo Cliente
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
