'use client'

import { useState, useCallback } from 'react'
import { CustomerProfile } from '@/lib/customer-generator'
import { Message, EvaluationScore, FeedbackItem } from '@/types'

type Phase = 'idle' | 'chat' | 'evaluating' | 'feedback'

interface FocusModule {
  slug: string
  title: string
}

export function useTraining(moduleSlug?: string) {
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [customer, setCustomer] = useState<CustomerProfile | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [phase, setPhase] = useState<Phase>('idle')
  const [evaluation, setEvaluation] = useState<EvaluationScore | null>(null)
  const [feedback, setFeedback] = useState<FeedbackItem[]>([])
  const [xpEarned, setXpEarned] = useState(0)
  const [coinsEarned, setCoinsEarned] = useState(0)
  const [converted, setConverted] = useState(false)
  const [summary, setSummary] = useState('')
  const [focusModule, setFocusModule] = useState<FocusModule | null>(null)

  const startSession = useCallback(async () => {
    setIsLoading(true)
    setEvaluation(null)
    setFeedback([])
    setMessages([])
    setSummary('')
    setConverted(false)

    try {
      const res = await fetch('/api/training/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleSlug ? { moduleSlug } : {}),
      })
      const data = await res.json()
      setSessionId(data.session.id)
      setCustomer(data.customer)
      setFocusModule(data.focusModule ?? null)
      setPhase('chat')
    } catch (error) {
      console.error('Failed to start session:', error)
    } finally {
      setIsLoading(false)
    }
  }, [moduleSlug])

  const sendMessage = useCallback(
    async (content: string) => {
      if (!customer || isTyping || !content.trim()) return

      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, userMessage])
      setIsTyping(true)

      const humanDelay = Math.random() * 2000 + 800

      try {
        const currentMessages = [...messages, userMessage]

        const res = await fetch('/api/training/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            message: content,
            customerProfile: customer,
            conversationHistory: currentMessages,
          }),
        })

        const data = await res.json()

        await new Promise((resolve) => setTimeout(resolve, humanDelay))

        if (data.response) {
          const customerMessage: Message = {
            id: crypto.randomUUID(),
            role: 'customer',
            content: data.response,
            timestamp: new Date(),
          }
          setMessages((prev) => [...prev, customerMessage])
        }
      } catch (error) {
        console.error('Send message error:', error)
      } finally {
        setIsTyping(false)
      }
    },
    [customer, sessionId, messages, isTyping]
  )

  const endSession = useCallback(async () => {
    if (!customer || messages.length < 2) return

    setPhase('evaluating')

    try {
      const res = await fetch('/api/training/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          customerProfile: customer,
          conversationHistory: messages,
        }),
      })

      const data = await res.json()

      if (data.error) {
        setPhase('chat')
        return
      }

      setEvaluation(data.evaluation)
      setFeedback(data.feedback || [])
      setXpEarned(data.xpEarned || 0)
      setCoinsEarned(data.coinsEarned || 0)
      setConverted(data.converted || false)
      setSummary(data.summary || '')
      setPhase('feedback')
    } catch (error) {
      console.error('End session error:', error)
      setPhase('chat')
    }
  }, [customer, sessionId, messages])

  const nextCustomer = useCallback(async () => {
    await startSession()
  }, [startSession])

  return {
    sessionId,
    customer,
    messages,
    isLoading,
    isTyping,
    phase,
    evaluation,
    feedback,
    xpEarned,
    coinsEarned,
    converted,
    summary,
    startSession,
    sendMessage,
    endSession,
    nextCustomer,
  }
}
