'use client'

import { motion } from 'framer-motion'
import { User, Users, MapPin, type LucideIcon } from 'lucide-react'
import { stagger, rise, inView } from './motion'

const CONTENT = {
  eyebrow: 'Para quem é',
  heading: 'Feito pra quem vende — e pra quem lidera.',
  cards: [
    {
      icon: User,
      title: 'Vendedores',
      body: 'Pratique conversas difíceis sem queimar leads reais e chegue mais preparado em cada ligação.',
    },
    {
      icon: Users,
      title: 'Gestores',
      body: 'Acompanhe a evolução por critério e enxergue exatamente onde o time trava.',
    },
    {
      icon: MapPin,
      title: 'Equipes de campo',
      body: 'Padronize o discurso e reduza o tempo de rampa de novos vendedores.',
    },
  ] as { icon: LucideIcon; title: string; body: string }[],
}

export function Audiences() {
  return (
    <section id="publico" aria-labelledby="publico-title" className="bg-[#f4f7fe] py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div {...inView} className="max-w-2xl">
          <p className="eyebrow text-brand">{CONTENT.eyebrow}</p>
          <h2
            id="publico-title"
            className="mt-4 text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-4xl md:text-[2.6rem]"
          >
            {CONTENT.heading}
          </h2>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="mt-14 grid gap-6 md:grid-cols-3"
        >
          {CONTENT.cards.map((card) => (
            <motion.div
              key={card.title}
              variants={rise}
              whileHover={{ y: -4 }}
              className="rounded-3xl border border-border bg-white p-7 shadow-soft transition-shadow hover:shadow-card"
            >
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-soft text-brand">
                <card.icon className="h-5 w-5" strokeWidth={1.9} aria-hidden />
              </span>
              <h3 className="mt-5 text-[18px] font-semibold tracking-tight">{card.title}</h3>
              <p className="mt-2.5 text-[14px] leading-relaxed text-muted-foreground">{card.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
