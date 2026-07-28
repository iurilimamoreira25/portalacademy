'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles } from 'lucide-react'
import { ease, focusRing } from './motion'

const CONTENT = {
  brand: 'Portal Academy',
  links: [
    { label: 'Produto', href: '#simula' },
    { label: 'Como funciona', href: '#como' },
    { label: 'Quem usa', href: '#publico' },
  ],
}

export function Nav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease }}
      className="sticky top-0 z-50 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className={`flex items-center gap-2.5 rounded-lg ${focusRing}`}>
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-brand to-brand-3 text-white shadow-glow">
            <Sparkles className="h-4 w-4" strokeWidth={2} aria-hidden />
          </span>
          <span className="text-[15px] font-semibold tracking-tight">{CONTENT.brand}</span>
        </Link>

        <nav aria-label="Navegação principal" className="hidden items-center gap-8 text-[14px] font-medium text-muted-foreground md:flex">
          {CONTENT.links.map((l) => (
            <a key={l.href} href={l.href} className={`rounded transition-colors hover:text-foreground ${focusRing}`}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={`rounded-full px-4 py-2 text-[14px] font-medium text-foreground/80 transition-colors hover:text-foreground ${focusRing}`}
          >
            Entrar
          </Link>
          <Link
            href="/register"
            className={`group inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[14px] font-semibold text-white shadow-glow transition-transform hover:-translate-y-px ${focusRing}`}
          >
            Começar
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} aria-hidden />
          </Link>
        </div>
      </div>
    </motion.header>
  )
}
