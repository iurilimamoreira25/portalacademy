'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { ArrowRight, Star, TrendingUp, Users, Target } from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']
const ease = [0.16, 1, 0.3, 1] as const
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }

function greeting(h: number) {
  if (h < 12) return 'Bom dia'
  if (h < 18) return 'Boa tarde'
  return 'Boa noite'
}

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<{
    stats: { totalSessions?: number; conversions?: number; avgScore?: number; trainigMinutes?: number } | null
    recentSessions: { evaluation?: { overall?: number } }[]
  } | null>(null)

  useEffect(() => {
    fetch('/api/stats').then((r) => r.json()).then(setStats).catch(() => {})
  }, [])

  const level = user?.level || 1
  const xp = user?.xp || 0
  const xpForNextLevel = level * 500
  const currentXP = xp % 500
  const progress = Math.min((currentXP / xpForNextLevel) * 100, 100)
  const firstName = user?.name?.split(' ')[0] ?? ''
  const s = stats?.stats

  const chartData = stats?.recentSessions?.map((sess, i) => ({
    day: DAYS[i % 7],
    nota: (sess.evaluation as { overall?: number })?.overall || 0,
  })) || []
  const hasChart = chartData.some((d) => d.nota > 0)

  const cards = [
    { label: 'XP acumulado', value: xp.toLocaleString('pt-BR'), icon: Star, gradient: true },
    { label: 'Nível atual', value: String(level), icon: TrendingUp },
    { label: 'Clientes atendidos', value: String(s?.totalSessions ?? 0), icon: Users },
    { label: 'Vendas fechadas', value: String(s?.conversions ?? 0), icon: Target },
  ]

  const rows = [
    { label: 'Horas treinando', value: `${Math.round((s?.trainigMinutes || 0) / 60)}h` },
    { label: 'Nota média', value: `${(s?.avgScore || 0).toFixed(0)}/100` },
    { label: 'Sequência', value: `${user?.streak || 0} dias` },
  ]

  const today = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="mx-auto max-w-6xl px-8 py-12 lg:px-12">
      {/* Header */}
      <motion.div variants={item} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-muted-foreground">{today}</p>
          <h1 className="mt-2.5 text-[2rem] font-bold tracking-[-0.02em] text-foreground">
            {greeting(new Date().getHours())}, {firstName}.
          </h1>
        </div>
        <button
          onClick={() => router.push('/train')}
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-[14px] font-semibold text-white shadow-glow transition-transform hover:-translate-y-0.5"
        >
          Iniciar treino
          <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
        </button>
      </motion.div>

      {/* Stat cards */}
      <motion.div variants={item} className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-white p-5 shadow-soft">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
              <c.icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
            </span>
            <p className="eyebrow mt-4 text-[10px]">{c.label}</p>
            <p className={`tnum mt-1.5 text-[1.75rem] font-bold tracking-tight ${c.gradient ? 'text-gradient' : 'text-foreground'}`}>
              {c.value}
            </p>
          </div>
        ))}
      </motion.div>

      {/* Body */}
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Evolution */}
        <motion.div variants={item} className="rounded-2xl border border-border bg-white p-6 shadow-soft">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[15px] font-semibold tracking-tight text-foreground">Evolução</h2>
            <span className="eyebrow text-[10px]">Últimas sessões</span>
          </div>
          <div className="mt-6 h-[220px]">
            {hasChart ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 6, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="evo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="var(--brand)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} dy={8} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} width={38} />
                  <Tooltip
                    cursor={{ stroke: 'var(--brand)', strokeOpacity: 0.25 }}
                    contentStyle={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12, boxShadow: '0 12px 32px -12px rgba(30,41,90,.22)' }}
                    labelStyle={{ color: 'var(--muted-foreground)' }}
                  />
                  <Area type="monotone" dataKey="nota" stroke="var(--brand)" strokeWidth={2.25} fill="url(#evo)" dot={false} activeDot={{ r: 4, fill: 'var(--brand)', stroke: '#fff', strokeWidth: 2 }} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full flex-col items-center justify-center rounded-xl bg-muted/60 text-center">
                <p className="max-w-xs text-[13px] leading-relaxed text-muted-foreground">
                  Sua curva de evolução aparece aqui depois do primeiro treino registrado.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Progress */}
        <motion.div variants={item} className="rounded-2xl border border-border bg-white p-6 shadow-soft">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[15px] font-semibold tracking-tight text-foreground">Progresso</h2>
            <span className="eyebrow text-[10px]">Nível {level} → {level + 1}</span>
          </div>
          <div className="mt-6">
            <div className="h-2 w-full rounded-full bg-muted">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 1, ease, delay: 0.3 }}
                style={{ transformOrigin: 'left' }}
                className="h-2 rounded-full bg-gradient-to-r from-brand to-brand-3"
              />
            </div>
            <p className="tnum mt-2.5 text-[12px] text-muted-foreground">
              {currentXP} / {xpForNextLevel} XP para o próximo nível
            </p>
          </div>
          <dl className="mt-6">
            {rows.map((r) => (
              <div key={r.label} className="flex items-center justify-between border-t border-border py-3 first:border-t-0">
                <dt className="text-[13px] text-muted-foreground">{r.label}</dt>
                <dd className="tnum text-[13px] font-semibold text-foreground">{r.value}</dd>
              </div>
            ))}
          </dl>
        </motion.div>
      </div>

      {/* CTA banner */}
      <motion.div
        variants={item}
        className="relative mt-6 overflow-hidden rounded-2xl bg-gradient-to-br from-brand via-brand-3 to-brand px-8 py-8 shadow-glow"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan/30 blur-[80px]" />
        <div className="relative flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-[1.25rem] font-bold tracking-tight text-white">Pronto para o próximo cliente?</h3>
            <p className="mt-1.5 text-[14px] text-white/85">Um novo desafio já está esperando por você.</p>
          </div>
          <button
            onClick={() => router.push('/train')}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-[14px] font-semibold text-brand transition-transform hover:-translate-y-0.5"
          >
            Treinar agora
            <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
