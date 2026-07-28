'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { ease, focusRing } from './motion'

const CONTENT = {
  heading: 'Comece a treinar sua equipe hoje.',
  subtitle: 'Crie sua conta em segundos. O primeiro cliente já está esperando por você.',
  primary: { label: 'Criar conta grátis', href: '/register' },
  secondary: { label: 'Já tenho conta', href: '/login' },
}

export function FinalCTA() {
  return (
    <section id="contato" aria-labelledby="cta-title" className="scroll-mt-24 px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8, ease }}
        className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand via-brand-3 to-brand px-8 py-16 text-center shadow-glow sm:px-16"
      >
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-cyan/40 blur-[90px]" aria-hidden />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-brand-2/50 blur-[90px]" aria-hidden />
        <div className="relative">
          <h2
            id="cta-title"
            className="mx-auto max-w-2xl text-3xl font-bold leading-tight tracking-[-0.02em] text-white sm:text-4xl md:text-[2.6rem]"
          >
            {CONTENT.heading}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[16px] leading-relaxed text-white/85">{CONTENT.subtitle}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href={CONTENT.primary.href}
              className={`group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 text-[15px] font-semibold text-brand transition-transform hover:-translate-y-0.5 ${focusRing} focus-visible:ring-white focus-visible:ring-offset-brand-3`}
            >
              {CONTENT.primary.label}
              <ArrowRight className="h-[18px] w-[18px] transition-transform group-hover:translate-x-0.5" strokeWidth={2} aria-hidden />
            </Link>
            <Link
              href={CONTENT.secondary.href}
              className={`inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-3.5 text-[15px] font-semibold text-white transition-colors hover:bg-white/10 ${focusRing} focus-visible:ring-white focus-visible:ring-offset-brand-3`}
            >
              {CONTENT.secondary.label}
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
