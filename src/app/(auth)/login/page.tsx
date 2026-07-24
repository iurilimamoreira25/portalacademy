'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sparkles, Mail, Lock, Eye, EyeOff, MessagesSquare, Gauge, Trophy } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { AuthHero } from '@/components/auth/AuthHero'

const FEATURES = [
  {
    icon: MessagesSquare,
    title: 'Clientes que reagem de verdade',
    description: 'Cada simulação gera um cliente novo, com humor, orçamento e objeções próprias.',
  },
  {
    icon: Gauge,
    title: 'Avaliação em 10 critérios',
    description: 'Feedback objetivo logo após a conversa — sem esperar o feedback do gestor.',
  },
  {
    icon: Trophy,
    title: 'Progresso que fica visível',
    description: 'XP, nível e ranking mostram evolução real ao longo das repetições.',
  },
]

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      router.push('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao fazer login'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[1.15fr_1fr]">
      <AuthHero eyebrow="Portal Temper · Academy" features={FEATURES}>
        <>
          Treine sob pressão.
          <br />
          <span className="text-gradient">Saia mais forte.</span>
        </>
      </AuthHero>

      <div className="flex items-center justify-center px-6 py-16 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-3 text-white shadow-glow">
              <Sparkles className="h-4 w-4" strokeWidth={2} />
            </span>
            <div>
              <p className="text-sm font-semibold leading-tight">Portal Temper</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Academy</p>
            </div>
          </div>

          <h1 className="text-[1.9rem] font-bold tracking-[-0.02em]">Bem-vindo de volta</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Entre para continuar seu treinamento.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="h-11 border-border/80 bg-card pl-10 focus-visible:ring-ice/30 focus-visible:border-ice/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Senha</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 border-border/80 bg-card pl-10 pr-10 focus-visible:ring-ice/30 focus-visible:border-ice/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors hover:text-foreground"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="h-11 w-full bg-primary font-medium text-primary-foreground hover:bg-primary/90"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground" />
                  Entrando...
                </span>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Não tem conta?{' '}
            <Link href="/register" className="font-medium text-foreground hover:text-ice transition-colors">
              Cadastre-se
            </Link>
          </p>

          <div className="mt-8 border-t border-border/60 pt-4">
            <p className="text-center font-mono text-[11px] text-muted-foreground/70">
              demo: admin@portaltemper.com · admin123
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
