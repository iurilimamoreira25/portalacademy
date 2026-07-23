'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import {
  Zap,
  LayoutDashboard,
  MessageSquare,
  Trophy,
  BarChart3,
  Settings,
  LogOut,
  Star,
  Flame,
  Coins,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/train', icon: MessageSquare, label: 'Treinar Agora' },
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

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0d0d0d] border-r border-white/[0.06] flex flex-col z-50">
      <div className="p-5 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/20">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">Portal Temper</p>
            <p className="text-white/30 text-[10px] tracking-widest uppercase">Academy</p>
          </div>
        </div>
      </div>

      {user && (
        <div className="p-4 border-b border-white/[0.06]">
          <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-3">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-violet-500 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-white font-semibold text-sm truncate leading-tight">
                  {user.name}
                </p>
                <p className="text-white/30 text-xs">Nível {level}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="flex items-center gap-1 text-yellow-400/80">
                <Star className="w-3 h-3" />
                {(user.xp || 0).toLocaleString('pt-BR')} XP
              </span>
              <span className="text-white/25">
                {currentXP}/{xpForNextLevel}
              </span>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full"
              />
            </div>

            <div className="flex items-center justify-between mt-2.5">
              <div className="flex items-center gap-1 text-orange-400/70">
                <Flame className="w-3 h-3" />
                <span className="text-xs">{user.streak || 0} dias</span>
              </div>
              <div className="flex items-center gap-1 text-amber-400/70">
                <Coins className="w-3 h-3" />
                <span className="text-xs">{user.coins || 0}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 2 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer',
                  isActive
                    ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20 shadow-sm'
                    : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
                )}
              >
                <item.icon
                  className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-blue-400' : '')}
                />
                {item.label}
              </motion.div>
            </Link>
          )
        })}

        {user?.role === 'ADMIN' && (
          <Link href="/admin">
            <motion.div
              whileHover={{ x: 2 }}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 cursor-pointer mt-2',
                pathname === '/admin'
                  ? 'bg-violet-500/15 text-violet-400 border border-violet-500/20'
                  : 'text-white/40 hover:text-white/80 hover:bg-white/[0.04]'
              )}
            >
              <Settings className="w-4 h-4 flex-shrink-0" />
              Administração
            </motion.div>
          </Link>
        )}
      </nav>

      <div className="p-4 border-t border-white/[0.06]">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/30 hover:text-red-400 hover:bg-red-500/8 transition-all duration-150 w-full"
        >
          <LogOut className="w-4 h-4" />
          Sair da conta
        </button>
      </div>
    </aside>
  )
}
