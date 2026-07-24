'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { Users, Target, TrendingUp, Clock } from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
} from 'recharts'

interface Stats {
  totalSessions?: number
  completedSessions?: number
  conversions?: number
  avgScore?: number
  avgEmpathy?: number
  avgCommunication?: number
  avgNegotiation?: number
  avgClosure?: number
  trainigMinutes?: number
}
interface Session { evaluation?: { overall?: number }; createdAt?: string }

const ease = [0.16, 1, 0.3, 1] as const
const container = { hidden: {}, show: { transition: { staggerChildren: 0.07, delayChildren: 0.04 } } }
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } } }

const tooltipStyle = {
  background: '#fff',
  border: '1px solid var(--border)',
  borderRadius: 12,
  fontSize: 12,
  boxShadow: '0 12px 32px -12px rgba(30,41,90,.22)',
}

export default function StatsPage() {
  const { user } = useAuth()
  const [data, setData] = useState<{ stats: Stats | null; recentSessions: Session[] } | null>(null)

  useEffect(() => {
    fetch('/api/stats').then((r) => r.json()).then(setData).catch(() => {})
  }, [])

  const stats = data?.stats

  const radarData = stats
    ? [
        { metric: 'Empatia', value: (stats.avgEmpathy || 0) * 10 },
        { metric: 'Comunicação', value: (stats.avgCommunication || 0) * 10 },
        { metric: 'Negociação', value: (stats.avgNegotiation || 0) * 10 },
        { metric: 'Fechamento', value: (stats.avgClosure || 0) * 10 },
        {
          metric: 'Conversão',
          value: stats.completedSessions && stats.completedSessions > 0 ? ((stats.conversions || 0) / stats.completedSessions) * 100 : 0,
        },
      ]
    : []
  const hasRadar = radarData.some((d) => d.value > 0)

  const sessionChart = data?.recentSessions?.map((s, i) => ({ sessao: `${i + 1}`, nota: (s.evaluation as { overall?: number })?.overall || 0 })) || []
  const hasSessions = sessionChart.some((d) => d.nota > 0)

  const cards = [
    { label: 'Sessões totais', value: String(stats?.totalSessions ?? 0), icon: Users },
    { label: 'Vendas fechadas', value: String(stats?.conversions ?? 0), icon: Target },
    { label: 'Nota média', value: `${(stats?.avgScore || 0).toFixed(0)}`, icon: TrendingUp, gradient: true },
    { label: 'Horas treinando', value: `${Math.round((stats?.trainigMinutes || 0) / 60)}h`, icon: Clock },
  ]

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="mx-auto max-w-6xl px-8 py-12 lg:px-12">
      <motion.header variants={item}>
        <p className="eyebrow text-brand">Desempenho</p>
        <h1 className="mt-3 text-[2rem] font-bold tracking-[-0.02em] text-foreground">Estatísticas</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          {user?.name} <span className="mx-1 text-muted-foreground/50">·</span> Nível {user?.level}
        </p>
      </motion.header>

      <motion.div variants={item} className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-white p-5 shadow-soft">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-soft text-brand">
              <c.icon className="h-[18px] w-[18px]" strokeWidth={1.9} />
            </span>
            <p className="eyebrow mt-4 text-[10px]">{c.label}</p>
            <p className={`tnum mt-1.5 text-[1.75rem] font-bold tracking-tight ${c.gradient ? 'text-gradient' : 'text-foreground'}`}>{c.value}</p>
          </div>
        ))}
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Skill radar */}
        <motion.div variants={item} className="rounded-2xl border border-border bg-white p-6 shadow-soft">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[15px] font-semibold tracking-tight text-foreground">Mapa de habilidades</h2>
            <span className="eyebrow text-[10px]">5 eixos</span>
          </div>
          <div className="mt-4 h-[300px]">
            {hasRadar ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="72%">
                  <defs>
                    <linearGradient id="radarFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--brand-3)" stopOpacity={0.15} />
                    </linearGradient>
                  </defs>
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} />
                  <Radar dataKey="value" stroke="var(--brand)" fill="url(#radarFill)" strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart>Suas competências aparecem aqui após o primeiro treino avaliado.</EmptyChart>
            )}
          </div>
        </motion.div>

        {/* Sessions bar */}
        <motion.div variants={item} className="rounded-2xl border border-border bg-white p-6 shadow-soft">
          <div className="flex items-baseline justify-between">
            <h2 className="text-[15px] font-semibold tracking-tight text-foreground">Notas por sessão</h2>
            <span className="eyebrow text-[10px]">Histórico</span>
          </div>
          <div className="mt-4 h-[300px]">
            {hasSessions ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={sessionChart} margin={{ top: 8, right: 6, left: -22, bottom: 0 }}>
                  <defs>
                    <linearGradient id="barFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--brand)" />
                      <stop offset="100%" stopColor="var(--brand-3)" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="var(--border)" />
                  <XAxis dataKey="sessao" axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} dy={6} />
                  <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }} width={38} />
                  <Tooltip cursor={{ fill: 'var(--brand-soft)' }} contentStyle={tooltipStyle} labelStyle={{ color: 'var(--muted-foreground)' }} />
                  <Bar dataKey="nota" fill="url(#barFill)" radius={[6, 6, 0, 0]} maxBarSize={30} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <EmptyChart>Cada treino concluído registra uma nota — seu histórico aparece aqui.</EmptyChart>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

function EmptyChart({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full items-center justify-center rounded-xl bg-muted/60 text-center">
      <p className="max-w-[16rem] text-[13px] leading-relaxed text-muted-foreground">{children}</p>
    </div>
  )
}
