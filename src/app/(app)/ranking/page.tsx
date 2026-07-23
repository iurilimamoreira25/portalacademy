'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Star, TrendingUp, Users, Crown } from 'lucide-react'

interface RankUser {
  id: string
  name: string
  level: number
  xp: number
  stats: { avgScore?: number; conversions?: number } | null
}

export default function RankingPage() {
  const [ranking, setRanking] = useState<RankUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/ranking')
      .then((r) => r.json())
      .then((d) => setRanking(d.ranking || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const podium = ranking.slice(0, 3)
  const rest = ranking.slice(3)

  const podiumOrder = [1, 0, 2]
  const podiumSizes = ['h-24', 'h-32', 'h-20']
  const crownColors = ['text-gray-300', 'text-yellow-400', 'text-amber-600']
  const borderColors = ['border-gray-500/20', 'border-yellow-500/30', 'border-amber-600/20']

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
          <Trophy className="w-7 h-7 text-yellow-400" />
          Ranking Global
        </h1>
        <p className="text-white/30 text-sm">Os melhores vendedores da Portal Temper Academy</p>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin" />
        </div>
      ) : ranking.length === 0 ? (
        <div className="text-center py-24 text-white/20">
          <Users className="w-14 h-14 mx-auto mb-4 opacity-30" />
          <p className="font-medium">Nenhum dado ainda</p>
          <p className="text-sm mt-1 text-white/15">Complete treinamentos para aparecer aqui</p>
        </div>
      ) : (
        <>
          {podium.length > 0 && (
            <div className="flex items-end justify-center gap-4 mb-10">
              {podiumOrder.map((idx) => {
                const rankUser = podium[idx]
                if (!rankUser) return <div key={idx} className="w-36" />
                const position = idx + 1
                return (
                  <motion.div
                    key={rankUser.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex flex-col items-center gap-3 w-36"
                  >
                    <Crown className={`w-6 h-6 ${crownColors[idx]}`} />
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      {rankUser.name.charAt(0)}
                    </div>
                    <div className="text-center">
                      <p className="text-white font-semibold text-sm">{rankUser.name}</p>
                      <p className="text-white/30 text-xs">Nível {rankUser.level}</p>
                      <div className="flex items-center justify-center gap-1 mt-1 text-yellow-400/80">
                        <Star className="w-3 h-3" />
                        <span className="text-xs font-medium">{rankUser.xp.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                    <div
                      className={`w-full ${podiumSizes[idx]} bg-white/[0.04] border ${borderColors[idx]} rounded-t-xl flex items-start justify-center pt-3`}
                    >
                      <span className={`text-2xl font-black ${crownColors[idx]}`}>#{position}</span>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )}

          {rest.length > 0 && (
            <div className="space-y-2">
              {rest.map((rankUser, i) => (
                <motion.div
                  key={rankUser.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-3.5 flex items-center gap-4 hover:bg-white/[0.05] transition-colors"
                >
                  <span className="text-white/20 font-bold text-sm w-7 text-right">
                    #{i + 4}
                  </span>
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400/50 to-violet-500/50 flex items-center justify-center text-white text-sm font-bold">
                    {rankUser.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white/80 text-sm font-medium truncate">{rankUser.name}</p>
                    <p className="text-white/25 text-xs">Nível {rankUser.level}</p>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <div className="flex items-center gap-1 text-yellow-400/60 justify-end">
                        <Star className="w-3 h-3" />
                        <span className="text-sm font-medium">{rankUser.xp.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-white/20">
                      <TrendingUp className="w-3 h-3" />
                      <span className="text-xs">{(rankUser.stats?.avgScore || 0).toFixed(0)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
