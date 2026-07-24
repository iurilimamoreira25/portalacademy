'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface RankUser {
  id: string
  name: string
  level: number
  xp: number
  stats: { avgScore?: number; conversions?: number } | null
}

const ease = [0.16, 1, 0.3, 1] as const

export default function RankingPage() {
  const { user } = useAuth()
  const [ranking, setRanking] = useState<RankUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/ranking')
      .then((r) => r.json())
      .then((d) => setRanking(d.ranking || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-8 py-12 lg:px-12">
      <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease }}>
        <p className="eyebrow text-brand">Classificação geral</p>
        <h1 className="mt-3 text-[2rem] font-bold tracking-[-0.02em] text-foreground">Ranking</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Os vendedores da Academy, ordenados por experiência acumulada.
        </p>
      </motion.header>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease, delay: 0.08 }}
        className="mt-8 overflow-hidden rounded-2xl border border-border bg-white shadow-soft"
      >
        {/* Header row */}
        <div className="grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-border px-5 py-3 sm:grid-cols-[2.5rem_1fr_5rem_7rem_4rem]">
          <span className="eyebrow text-[10px]">#</span>
          <span className="eyebrow text-[10px]">Vendedor</span>
          <span className="eyebrow hidden text-right text-[10px] sm:block">Nível</span>
          <span className="eyebrow text-right text-[10px]">XP</span>
          <span className="eyebrow hidden text-right text-[10px] sm:block">Nota</span>
        </div>

        {loading ? (
          <div className="flex h-48 items-center justify-center">
            <div className="h-5 w-5 animate-spin rounded-full border-[1.5px] border-brand/25 border-t-brand" />
          </div>
        ) : ranking.length === 0 ? (
          <p className="py-20 text-center text-[14px] text-muted-foreground">
            Nenhum vendedor classificado ainda. Complete um treino para entrar no ranking.
          </p>
        ) : (
          <ul>
            {ranking.map((r, i) => {
              const isYou = r.id === user?.id
              const position = i + 1
              return (
                <motion.li
                  key={r.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease, delay: Math.min(i * 0.03, 0.3) }}
                  className={cn(
                    'relative grid grid-cols-[2.5rem_1fr_auto] items-center gap-4 border-b border-border px-5 py-3.5 last:border-b-0 sm:grid-cols-[2.5rem_1fr_5rem_7rem_4rem]',
                    isYou && 'bg-brand-soft'
                  )}
                >
                  {isYou && <span className="absolute left-0 top-0 h-full w-1 bg-brand" />}
                  <span className={cn('tnum text-[14px] font-semibold', position === 1 ? 'text-brand' : 'text-muted-foreground')}>
                    {position}
                  </span>
                  <div className="flex min-w-0 items-center gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-2 to-brand-3 text-[13px] font-semibold text-white">
                      {r.name.charAt(0).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 truncate text-[14px] font-semibold text-foreground">
                        {r.name}
                        {isYou && (
                          <span className="rounded-full bg-brand px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                            você
                          </span>
                        )}
                      </p>
                      <p className="text-[12px] text-muted-foreground sm:hidden">Nível {r.level}</p>
                    </div>
                  </div>
                  <span className="tnum hidden text-right text-[14px] text-muted-foreground sm:block">{r.level}</span>
                  <span className="tnum text-right text-[14px] font-semibold text-foreground">{r.xp.toLocaleString('pt-BR')}</span>
                  <span className="tnum hidden text-right text-[14px] text-muted-foreground sm:block">{(r.stats?.avgScore || 0).toFixed(0)}</span>
                </motion.li>
              )
            })}
          </ul>
        )}
      </motion.div>
    </div>
  )
}
