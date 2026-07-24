'use client'

import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import {
  ArrowRight,
  Sparkles,
  MessagesSquare,
  Gauge,
  TrendingUp,
  Play,
  Check,
  X,
} from 'lucide-react'

const ease = [0.16, 1, 0.3, 1] as const

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}
const rise = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const [showBanner, setShowBanner] = useState(true)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 60, damping: 18 })
  const sy = useSpring(my, { stiffness: 60, damping: 18 })

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = heroRef.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  // Parallax layers at different depths
  const blobAX = useTransform(sx, (v) => v * -60)
  const blobAY = useTransform(sy, (v) => v * -60)
  const blobBX = useTransform(sx, (v) => v * 50)
  const blobBY = useTransform(sy, (v) => v * 50)
  const cardFarX = useTransform(sx, (v) => v * 26)
  const cardFarY = useTransform(sy, (v) => v * 26)
  const cardNearX = useTransform(sx, (v) => v * -40)
  const cardNearY = useTransform(sy, (v) => v * -40)

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-white text-foreground">
      {/* ============ Ambient background ============ */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />
        <motion.div
          style={mounted ? { x: blobAX, y: blobAY } : undefined}
          className="animate-aurora absolute -left-40 -top-40 h-[42rem] w-[42rem] rounded-full opacity-70 blur-[120px]"
        >
          <div className="h-full w-full rounded-full bg-gradient-to-br from-brand/50 via-brand-2/40 to-transparent" />
        </motion.div>
        <motion.div
          style={mounted ? { x: blobBX, y: blobBY } : undefined}
          className="animate-aurora absolute -right-40 top-10 h-[38rem] w-[38rem] rounded-full opacity-60 blur-[120px] [animation-delay:-6s]"
        >
          <div className="h-full w-full rounded-full bg-gradient-to-br from-brand-3/45 via-cyan/30 to-transparent" />
        </motion.div>
        <div className="absolute inset-x-0 top-[46rem] h-72 bg-gradient-to-b from-transparent to-[#f4f7fe]" />
      </div>

      {/* ============ Announcement bar ============ */}
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease }}
          className="w-full bg-gradient-to-r from-brand to-brand-3"
        >
          <div className="relative mx-auto flex max-w-6xl items-center justify-center px-10 py-2.5">
            <p className="text-center text-[13px] font-medium text-white sm:text-sm">
              🚀 Em breve: conteúdo exclusivo de treinamento pra sua equipe fechar mais
              vendas<span className="hidden sm:inline"> com cada cliente</span>.
            </p>
            <button
              onClick={() => setShowBanner(false)}
              aria-label="Fechar aviso"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-white/70 transition-colors hover:bg-white/15 hover:text-white"
            >
              <X className="h-4 w-4" strokeWidth={2} />
            </button>
          </div>
        </motion.div>
      )}

      {/* ============ Nav ============ */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="sticky top-0 z-50"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-3 text-white shadow-glow">
              <Sparkles className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight">Portal Academy</span>
          </Link>
          <nav className="hidden items-center gap-8 text-[14px] font-medium text-muted-foreground md:flex">
            <a href="#produto" className="transition-colors hover:text-foreground">Produto</a>
            <a href="#recursos" className="transition-colors hover:text-foreground">Recursos</a>
            <a href="#como" className="transition-colors hover:text-foreground">Como funciona</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="rounded-full px-4 py-2 text-[14px] font-medium text-foreground/80 transition-colors hover:text-foreground"
            >
              Entrar
            </Link>
            <Link
              href="/register"
              className="group inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[14px] font-semibold text-white shadow-glow transition-transform hover:-translate-y-px"
            >
              Começar
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </motion.header>

      {/* ============ Hero ============ */}
      <section
        ref={heroRef}
        onMouseMove={onMove}
        className="relative mx-auto max-w-6xl px-6 pb-24 pt-16 lg:pt-24"
      >
        <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
          {/* Copy */}
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div variants={rise}>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand/15 bg-brand-soft px-3 py-1.5 text-[13px] font-medium text-brand">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                Treinamento comercial com IA
              </span>
            </motion.div>

            <motion.h1
              variants={rise}
              className="mt-6 text-[2.9rem] font-extrabold leading-[1.03] tracking-[-0.03em] text-foreground sm:text-[3.6rem]"
            >
              Treine vendas com IA.
              <br />
              <span className="text-gradient">Feche mais</span> no mundo real.
            </motion.h1>

            <motion.p
              variants={rise}
              className="mt-6 max-w-md text-[17px] leading-relaxed text-muted-foreground"
            >
              Cada sessão gera um cliente simulado com objeções próprias. Sua equipe pratica as
              conversas difíceis, recebe avaliação em segundos e evolui — sem esperar o feedback do
              gestor.
            </motion.p>

            <motion.div variants={rise} className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-[15px] font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
              >
                Começar agora
                <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-6 py-3.5 text-[15px] font-semibold text-foreground shadow-soft transition-colors hover:bg-muted"
              >
                <Play className="h-[16px] w-[16px] fill-current" strokeWidth={0} />
                Ver demonstração
              </Link>
            </motion.div>

            <motion.div variants={rise} className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-muted-foreground">
              {['10 critérios avaliados', 'Clientes ilimitados', 'Feedback em segundos'].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-brand" strokeWidth={2.5} />
                  {t}
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* Floating product visual */}
          <div className="relative h-[420px] lg:h-[500px]">
            {/* Score card (far layer) */}
            <motion.div
              style={mounted ? { x: cardFarX, y: cardFarY } : undefined}
              initial={{ opacity: 0, y: 30, rotate: -6 }}
              animate={{ opacity: 1, y: 0, rotate: -6 }}
              transition={{ duration: 0.8, ease, delay: 0.3 }}
              className="absolute left-2 top-4 w-60"
            >
              <div className="animate-floaty rounded-3xl bg-white p-6 shadow-card">
                <p className="eyebrow">Nota do atendimento</p>
                <div className="mt-3 flex items-end gap-1.5">
                  <span className="text-gradient text-6xl font-extrabold tracking-tight tnum">92</span>
                  <span className="mb-2 text-sm font-medium text-muted-foreground">/100</span>
                </div>
                <div className="mt-4 h-1.5 w-full rounded-full bg-muted">
                  <div className="h-1.5 w-[92%] rounded-full bg-gradient-to-r from-brand to-brand-3" />
                </div>
                <p className="mt-3 text-[13px] text-muted-foreground">Empatia e fechamento acima da média.</p>
              </div>
            </motion.div>

            {/* Chat card (near layer) */}
            <motion.div
              style={mounted ? { x: cardNearX, y: cardNearY } : undefined}
              initial={{ opacity: 0, y: 40, rotate: 5 }}
              animate={{ opacity: 1, y: 0, rotate: 5 }}
              transition={{ duration: 0.8, ease, delay: 0.45 }}
              className="absolute bottom-6 right-0 w-64"
            >
              <div className="animate-floaty rounded-3xl bg-white p-5 shadow-card [animation-delay:-3s]">
                <div className="flex items-center gap-2.5">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-brand-2 to-brand-3 text-[13px] font-semibold text-white">R</span>
                  <div>
                    <p className="text-[13px] font-semibold leading-none">Rafael · cliente</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">simulado por IA</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-muted px-3.5 py-2 text-[13px] text-foreground/80">
                    Achei caro. O concorrente faz por menos.
                  </div>
                  <div className="ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-primary px-3.5 py-2 text-[13px] text-white">
                    Entendo — posso te mostrar o custo real ao longo do tempo?
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Small streak chip */}
            <motion.div
              style={mounted ? { x: cardFarX, y: cardFarY } : undefined}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease, delay: 0.6 }}
              className="absolute right-10 top-0"
            >
              <div className="glass animate-floaty flex items-center gap-2 rounded-full px-4 py-2 shadow-soft [animation-delay:-1.5s]">
                <TrendingUp className="h-4 w-4 text-brand" strokeWidth={2} />
                <span className="text-[13px] font-semibold">+38% conversão</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ Features ============ */}
      <section id="recursos" className="relative bg-[#f4f7fe] py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease }}
            className="max-w-2xl"
          >
            <p className="eyebrow text-brand">Por que funciona</p>
            <h2 className="mt-4 text-[2.2rem] font-bold leading-tight tracking-[-0.02em] sm:text-[2.6rem]">
              A prática que a sala de aula não entrega.
            </h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            className="mt-14 grid gap-6 md:grid-cols-3"
          >
            {[
              {
                icon: MessagesSquare,
                title: 'Clientes que reagem de verdade',
                body: 'Cada simulação cria um cliente novo — humor, orçamento e objeções próprias. Nenhuma conversa é igual à anterior.',
              },
              {
                icon: Gauge,
                title: 'Avaliação instantânea',
                body: 'Dez critérios pontuados em segundos ao fim da conversa, com feedback objetivo do que ajustar na próxima.',
              },
              {
                icon: TrendingUp,
                title: 'Evolução mensurável',
                body: 'XP, níveis e ranking transformam repetição em progresso visível — para o vendedor e para o gestor.',
              },
            ].map((f) => (
              <motion.div
                key={f.title}
                variants={rise}
                whileHover={{ y: -4 }}
                className="rounded-3xl border border-border bg-white p-7 shadow-soft transition-shadow hover:shadow-card"
              >
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-brand">
                  <f.icon className="h-5 w-5" strokeWidth={1.9} />
                </span>
                <h3 className="mt-5 text-[17px] font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground">{f.body}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ CTA band ============ */}
      <section id="como" className="relative px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, ease }}
          className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand via-brand-3 to-brand px-8 py-16 text-center shadow-glow sm:px-16"
        >
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan/40 blur-[90px]" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-brand-2/50 blur-[90px]" />
          <div className="relative">
            <h2 className="mx-auto max-w-2xl text-[2.1rem] font-bold leading-tight tracking-[-0.02em] text-white sm:text-[2.6rem]">
              Comece a treinar sua equipe hoje.
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-[16px] leading-relaxed text-white/85">
              Crie sua conta em segundos. O primeiro cliente já está esperando por você.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[15px] font-semibold text-brand transition-transform hover:-translate-y-0.5"
              >
                Criar conta grátis
                <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
              </Link>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                Já tenho conta
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============ Footer ============ */}
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-8 text-[13px] text-muted-foreground sm:flex-row">
          <div className="flex items-center gap-2.5">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-gradient-to-br from-brand to-brand-3 text-white">
              <Sparkles className="h-3 w-3" strokeWidth={2} />
            </span>
            <span className="font-medium text-foreground">Portal Academy</span>
          </div>
          <p>© {new Date().getFullYear()} Portal Academy. Treinamento comercial com IA.</p>
        </div>
      </footer>
    </div>
  )
}
