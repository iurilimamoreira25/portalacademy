'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Lock, User, Sparkles, Target, LineChart } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { AuthHero } from '@/components/auth/AuthHero'

const FEATURES = [
  {
    icon: Sparkles,
    title: 'Sem dois treinos iguais',
    description: 'A cada sessão, um cliente novo — personalidade, humor e objeções diferentes.',
  },
  {
    icon: Target,
    title: 'Prática com propósito',
    description: 'Metas claras a cada rodada, com feedback direto sobre o que ajustar.',
  },
  {
    icon: LineChart,
    title: 'Curva de evolução real',
    description: 'Cada repetição soma XP e nível — o progresso fica registrado, não só sentido.',
  },
]

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }
    setLoading(true)
    try {
      await register(name, email, password)
      toast.success('Conta criada! Bem-vindo à Academy.')
      router.push('/dashboard')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao cadastrar'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[1.15fr_1fr]">
      <AuthHero eyebrow="Portal · Academy" features={FEATURES}>
        <>
          Comece sob pressão
          <br />
          <span className="text-gradient">controlada.</span>
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
              <p className="text-sm font-semibold leading-tight">Portal Academy</p>
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">Academy</p>
            </div>
          </div>

          <h1 className="text-[1.9rem] font-bold tracking-[-0.02em]">Criar sua conta</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Comece a treinar hoje mesmo.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Nome completo</label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  type="text"
                  placeholder="Seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoFocus
                  className="h-11 border-border/80 bg-card pl-10 focus-visible:ring-ice/30 focus-visible:border-ice/50"
                />
              </div>
            </div>

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
                  className="h-11 border-border/80 bg-card pl-10 focus-visible:ring-ice/30 focus-visible:border-ice/50"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-muted-foreground">Senha</label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/60" />
                <Input
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-11 border-border/80 bg-card pl-10 focus-visible:ring-ice/30 focus-visible:border-ice/50"
                />
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
                  Criando conta...
                </span>
              ) : (
                'Criar conta grátis'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Já tem conta?{' '}
            <Link href="/login" className="font-medium text-foreground hover:text-ice transition-colors">
              Entrar
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  )
}
