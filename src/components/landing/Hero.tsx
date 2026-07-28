'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion'
import { ArrowRight, Play, TrendingUp } from 'lucide-react'
import { ease, stagger, rise, focusRing } from './motion'

const CONTENT = {
  eyebrow: 'Treinamento comercial com IA',
  headlinePre: 'Treine vendas com IA.',
  headlineAccent: 'Feche mais',
  headlinePost: ' no mundo real.',
  subtitle:
    'Cada sessão gera um cliente simulado com objeções próprias. Sua equipe pratica as conversas difíceis, recebe avaliação em segundos e evolui — sem esperar o feedback do gestor.',
  ctaPrimary: { label: 'Começar agora', href: '/register' },
  ctaSecondary: { label: 'Ver demonstração', href: '/login' },
  score: { label: 'Nota do atendimento', value: '92', outOf: '/100', note: 'Empatia e fechamento acima da média.' },
  chat: {
    name: 'Rafael · cliente',
    sub: 'simulado por IA',
    customer: 'Achei caro. O concorrente faz por menos.',
    reply: 'Entendo — posso te mostrar o custo real ao longo do tempo?',
  },
  chip: '+38% conversão',
}

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18 })
  const sy = useSpring(my, { stiffness: 60, damping: 18 })

  const onMove = (e: React.MouseEvent<HTMLElement>) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  const blobAX = useTransform(sx, (v) => v * -60)
  const blobAY = useTransform(sy, (v) => v * -60)
  const blobBX = useTransform(sx, (v) => v * 50)
  const blobBY = useTransform(sy, (v) => v * 50)
  const cardFarX = useTransform(sx, (v) => v * 26)
  const cardFarY = useTransform(sy, (v) => v * 26)
  const cardNearX = useTransform(sx, (v) => v * -40)
  const cardNearY = useTransform(sy, (v) => v * -40)

  // Parallax only when mounted (SSR-safe) and motion is allowed.
  const par = mounted && !reduce
  const c = CONTENT

  return (
    <section ref={ref} onMouseMove={onMove} className="relative overflow-hidden">
      {/* Aurora background — soft blue glow, never flat */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
        <motion.div
          style={par ? { x: blobAX, y: blobAY } : undefined}
          className="animate-aurora absolute -left-40 -top-40 h-[42rem] w-[42rem] rounded-full opacity-70 blur-[120px]"
        >
          <div className="h-full w-full rounded-full bg-gradient-to-br from-brand/50 via-brand-2/40 to-transparent" />
        </motion.div>
        <motion.div
          style={par ? { x: blobBX, y: blobBY } : undefined}
          className="animate-aurora absolute -right-40 top-10 h-[38rem] w-[38rem] rounded-full opacity-60 blur-[120px] [animation-delay:-6s]"
        >
          <div className="h-full w-full rounded-full bg-gradient-to-br from-brand-3/45 via-cyan/30 to-transparent" />
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-white" />
      </div>

      <div className="mx-auto max-w-6xl px-6 pb-24 pt-16 lg:pt-24">
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Copy */}
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={rise}>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand-soft px-3 py-1.5 text-[13px] font-medium text-brand">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" aria-hidden />
                {c.eyebrow}
              </span>
            </motion.div>

            <motion.h1
              variants={rise}
              className="mt-6 text-4xl font-extrabold leading-[1.04] tracking-[-0.03em] text-foreground sm:text-5xl md:text-6xl"
            >
              {c.headlinePre}
              <br />
              <span className="text-gradient">{c.headlineAccent}</span>
              {c.headlinePost}
            </motion.h1>

            <motion.p
              variants={rise}
              className="mt-6 max-w-md text-[17px] leading-relaxed text-muted-foreground"
            >
              {c.subtitle}
            </motion.p>

            <motion.div variants={rise} className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href={c.ctaPrimary.href}
                className={`group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[15px] font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5 ${focusRing}`}
              >
                {c.ctaPrimary.label}
                <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" strokeWidth={2} aria-hidden />
              </Link>
              <Link
                href={c.ctaSecondary.href}
                className={`inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3.5 text-[15px] font-semibold text-foreground shadow-soft transition-colors hover:bg-muted ${focusRing}`}
              >
                <Play className="h-[16px] w-[16px] fill-current" strokeWidth={0} aria-hidden />
                {c.ctaSecondary.label}
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating product visual (decorative, desktop-only to avoid a mobile void) */}
          <div aria-hidden className="hidden h-[500px] lg:relative lg:block">
            <motion.div
              style={par ? { x: cardFarX, y: cardFarY } : undefined}
              initial={{ opacity: 0, y: 30, rotate: -6 }}
              animate={{ opacity: 1, y: 0, rotate: -6 }}
              transition={{ duration: 0.8, ease, delay: 0.3 }}
              className="absolute left-2 top-4 w-60"
            >
              <div className="animate-floaty rounded-3xl bg-white p-6 shadow-card">
                <p className="eyebrow">{c.score.label}</p>
                <div className="mt-3 flex items-end gap-1.5">
                  <span className="text-gradient text-6xl font-extrabold tracking-tight tnum">{c.score.value}</span>
                  <span className="mb-2 text-sm font-medium text-muted-foreground">{c.score.outOf}</span>
                </div>
                <div className="mt-4 h-1.5 w-full rounded-full bg-muted">
                  <div className="h-1.5 w-[92%] rounded-full bg-gradient-to-r from-brand to-brand-3" />
                </div>
                <p className="mt-3 text-[13px] text-muted-foreground">{c.score.note}</p>
              </div>
            </motion.div>

            <motion.div
              style={par ? { x: cardNearX, y: cardNearY } : undefined}
              initial={{ opacity: 0, y: 40, rotate: 5 }}
              animate={{ opacity: 1, y: 0, rotate: 5 }}
              transition={{ duration: 0.8, ease, delay: 0.45 }}
              className="absolute bottom-6 right-0 w-64"
            >
              <div className="animate-floaty rounded-3xl bg-white p-5 shadow-card [animation-delay:-3s]">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand-2 to-brand-3 text-[13px] font-semibold text-white">R</span>
                  <div>
                    <p className="text-[13px] font-semibold leading-none">{c.chat.name}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">{c.chat.sub}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-muted px-3.5 py-2 text-[13px] text-foreground/80">
                    {c.chat.customer}
                  </div>
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-[13px] text-white">
                    {c.chat.reply}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              style={par ? { x: cardFarX, y: cardFarY } : undefined}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease, delay: 0.6 }}
              className="absolute right-10 top-0"
            >
              <div className="glass animate-floaty flex items-center gap-2 rounded-full px-4 py-2 shadow-soft [animation-delay:-1.5s]">
                <TrendingUp className="h-4 w-4 text-brand" strokeWidth={2} />
                <span className="text-[13px] font-semibold">{c.chip}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
