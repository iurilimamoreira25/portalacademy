'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
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
import { BarChart3, Target, Clock, TrendingUp, Users } from 'lucide-react'

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

interface Session {
  evaluation?: { overall?: number }
  createdAt?: string
}

export default function StatsPage() {
  const { user } = useAuth()
  const [data, setData] = useState<{ stats: Stats | null; recentSessions: Session[] } | null>(null)

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => {})
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
          value:
            stats.completedSessions && stats.completedSessions > 0
              ? ((stats.conversions || 0) / stats.completedSessions) * 100
              : 0,
        },
      ]
    : []

  const sessionChart =
    data?.recentSessions?.map((s, i) => ({
      sessao: `#${i + 1}`,
      nota: (s.evaluation as { overall?: number })?.overall || 0,
    })) || []

  const kpis = [
    {
      label: 'Sessões Totais',
      value: stats?.totalSessions || 0,
      icon: Users,
      color: 'text-blue-400',
      bg: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Vendas Fechadas',
      value: stats?.conversions || 0,
      icon: Target,
      color: 'text-emerald-400',
      bg: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Nota Média',
      value: `${(stats?.avgScore || 0).toFixed(0)}/100`,
      icon: TrendingUp,
      color: 'text-yellow-400',
      bg: 'from-yellow-500 to-orange-500',
    },
    {
      label: 'Horas Treinando',
      value: `${Math.round((stats?.trainigMinutes || 0) / 60)}h`,
      icon: Clock,
      color: 'text-violet-400',
      bg: 'from-violet-500 to-purple-600',
    },
  ]

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
          <BarChart3 className="w-7 h-7 text-blue-400" />
          Estatísticas
        </h1>
        <p className="text-white/30 text-sm">
          {user?.name} · Nível {user?.level}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-5"
          >
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${kpi.bg} flex items-center justify-center mb-4`}>
              <kpi.icon className="w-5 h-5 text-white" />
            </div>
            <p className="text-white/35 text-xs uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className="text-2xl font-bold text-white">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6"
        >
          <h2 className="text-white font-semibold mb-5 text-sm">Mapa de Habilidades</h2>
          {radarData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="#ffffff08" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#ffffff40', fontSize: 10 }} />
                <Radar
                  dataKey="value"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.15}
                  strokeWidth={1.5}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-white/20 text-sm">
              Complete treinamentos para ver suas habilidades
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6"
        >
          <h2 className="text-white font-semibold mb-5 text-sm">Notas por Sessão</h2>
          {sessionChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={sessionChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff06" />
                <XAxis
                  dataKey="sessao"
                  stroke="#ffffff15"
                  tick={{ fill: '#ffffff35', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#ffffff15"
                  tick={{ fill: '#ffffff35', fontSize: 10 }}
                  axisLine={false}
                  tickLine={false}
                  domain={[0, 100]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#111',
                    border: '1px solid #ffffff15',
                    borderRadius: '10px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="nota" fill="#3b82f6" radius={[4, 4, 0, 0]} opacity={0.85} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-white/20 text-sm">
              Complete treinamentos para ver seu histórico
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
