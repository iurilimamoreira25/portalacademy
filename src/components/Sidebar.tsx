'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  MessageSquare,
  Trophy,
  BarChart3,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Visão geral' },
  { href: '/train', icon: MessageSquare, label: 'Treinar' },
  { href: '/ranking', icon: Trophy, label: 'Ranking' },
  { href: '/stats', icon: BarChart3, label: 'Estatísticas' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const level = user?.level || 1
  const xpForNextLevel = level * 500
  const currentXP = (user?.xp || 0) % 500
  const progress = Math.min((currentXP / xpForNextLevel) * 100, 100)

  const items =
    user?.role === 'ADMIN'
      ? [...navItems, { href: '/admin', icon: Settings, label: 'Administração' }]
      : navItems

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[248px] flex-col border-r border-sidebar-border bg-sidebar">
      {/* Wordmark */}
      <div className="px-5 pt-6 pb-5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-3 text-white shadow-glow">
            <Sparkles className="h-4 w-4" strokeWidth={2} />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[14px] font-semibold tracking-tight text-foreground">
              Portal Academy
            </span>
            <span className="eyebrow mt-1 text-[9px]">Academy</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3">
        <ul className="space-y-1">
          {items.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href} className="relative">
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                    className="absolute inset-0 -z-10 rounded-xl bg-brand-soft"
                  />
                )}
                <Link
                  href={item.href}
                  className={cn(
                    'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-[14px] font-medium transition-colors',
                    isActive
                      ? 'text-brand'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon
                    className={cn(
                      'h-[18px] w-[18px] shrink-0',
                      isActive ? 'text-brand' : 'text-muted-foreground group-hover:text-foreground'
                    )}
                    strokeWidth={1.9}
                  />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Identity + progress */}
      {user && (
        <div className="m-3 rounded-2xl border border-border bg-white p-3 shadow-soft">
          <div className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-2 to-brand-3 text-[14px] font-semibold text-white">
              {user.name.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold leading-tight text-foreground">
                {user.name}
              </p>
              <p className="eyebrow mt-1 text-[9px]">Nível {level}</p>
            </div>
            <button
              onClick={logout}
              aria-label="Sair da conta"
              className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" strokeWidth={1.9} />
            </button>
          </div>

          <div className="mt-3">
            <div className="mb-1.5 flex items-baseline justify-between">
              <span className="tnum text-[11px] font-medium text-foreground">
                {(user.xp || 0).toLocaleString('pt-BR')} XP
              </span>
              <span className="tnum text-[10px] text-muted-foreground">
                {currentXP}/{xpForNextLevel}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-muted">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: progress / 100 }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                style={{ transformOrigin: 'left' }}
                className="h-1.5 rounded-full bg-gradient-to-r from-brand to-brand-3"
              />
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}
