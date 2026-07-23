'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import {
  Star,
  TrendingUp,
  Users,
  Target,
  Zap,
  ArrowRight,
  BarChart2,
  Clock,
  Award,
  Flame,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const DAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<{
    stats: {
      totalSessions?: number
      conversions?: number
      avgScore?: number
      trainigMinutes?: number
    } | null
    recentSessions: { evaluation?: { overall?: number } }[]
  } | null>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d) => setStats(d))
      .catch(() => {})
  }, [])

  const level = user?.level || 1
  const xp = user?.xp || 0
  const xpForNextLevel = level * 500
  const currentXP = xp % 500
  const progress = Math.min((currentXP / xpForNextLevel) * 100, 100)

  const chartData = stats?.recentSessions?.map((s, i) => ({
    day: DAYS[i % 7],
    nota: (s.evaluation as { overall?: number })?.overall || 0,
  })) || DAYS.map((d) => ({ day: d, nota: 0 }))

  const cards = [
    {
      label: 'XP Total',
      value: xp.toLocaleString('pt-BR'),
      icon: Star,
      color: 'from-yellow-500 to-orange-500',
      bg: 'bg-yellow-500/10',
      shadow: 'shadow-yellow-500/10',
    },
    {
      label: 'Nível Atual',
      value: `${level}`,
      icon: TrendingUp,
      color: 'from-blue-500 to-violet-500',
      bg: 'bg-blue-500/10',
      shadow: 'shadow-blue-500/10',
    },
    {
      label: 'Clientes Atendidos',
      value: `${stats?.stats?.totalSessions || 0}`,
      icon: Users,
      color: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-500/10',
      shadow: 'shadow-emerald-500/10',
    },
    {
      label: 'Vendas Fechadas',
      value: `${stats?.stats?.conversions || 0}`,
      icon: Target,
      color: 'from-pink-500 to-rose-500',
      bg: 'bg-pink-500/10',
      shadow: 'shadow-pink-500/10',
    },
  ]

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-1">
          Olá, {user?.name?.split(' ')[0]}!{' '}
          <span className="text-white/20">👋</span>
        </h1>
        <p className="text-white/30">
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5 shadow-lg ${card.shadow}`}
          >
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-4 shadow-lg`}
            >
              <card.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-white/40 text-xs mb-1 uppercase tracking-wider">{card.label}</p>
            <p className="text-2xl font-bold text-white">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6"
        >
          <h2 className="text-white font-semibold mb-5 flex items-center gap-2 text-sm">
            <BarChart2 className="w-4 h-4 text-blue-400" />
            Evolução Recente
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff07" />
              <XAxis
                dataKey="day"
                stroke="#ffffff15"
                tick={{ fill: '#ffffff35', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                stroke="#ffffff15"
                tick={{ fill: '#ffffff35', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#111',
                  border: '1px solid #ffffff15',
                  borderRadius: '12px',
                  color: '#fff',
                  fontSize: '12px',
                }}
              />
              <Area
                type="monotone"
                dataKey="nota"
                stroke="#3b82f6"
                fill="url(#scoreGrad)"
                strokeWidth={2}
                dot={{ fill: '#3b82f6', r: 3 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6"
        >
          <h2 className="text-white font-semibold mb-5 flex items-center gap-2 text-sm">
            <Zap className="w-4 h-4 text-yellow-400" />
            Seu Progresso
          </h2>

          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40 text-xs">Nível {level}</span>
              <span className="text-white/40 text-xs">Nível {level + 1}</span>
            </div>
            <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
              />
            </div>
            <p className="text-white/25 text-xs mt-1.5 text-right">
              {currentXP}/{xpForNextLevel} XP
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-white/35 text-sm flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-400/60" />
                Horas treinando
              </span>
              <span className="text-white/70 font-medium text-sm">
                {Math.round((stats?.stats?.trainigMinutes || 0) / 60)}h
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/35 text-sm flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-amber-400/60" />
                Nota média
              </span>
              <span className="text-white/70 font-medium text-sm">
                {(stats?.stats?.avgScore || 0).toFixed(0)}/100
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/35 text-sm flex items-center gap-2">
                <Flame className="w-3.5 h-3.5 text-orange-400/60" />
                Sequência
              </span>
              <span className="text-white/70 font-medium text-sm">{user?.streak || 0} dias</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-r from-blue-600/80 to-violet-600/80 border border-blue-500/20 rounded-2xl p-7 flex items-center justify-between"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-violet-600 opacity-20" />
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
        <div className="relative">
          <h3 className="text-white font-bold text-xl mb-1">
            Pronto para o próximo cliente?
          </h3>
          <p className="text-white/60 text-sm">Um novo desafio está esperando por você agora</p>
        </div>
        <Button
          onClick={() => router.push('/train')}
          className="relative bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-6 gap-2 backdrop-blur-sm transition-all"
        >
          Treinar agora
          <ArrowRight className="w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  )
}
