'use client'

import { motion } from 'framer-motion'
import {
  DollarSign,
  HelpCircle,
  GitCompare,
  Clock,
  ShieldAlert,
  Percent,
  UserX,
  type LucideIcon,
} from 'lucide-react'
import { stagger, rise, inView } from './motion'

const CONTENT = {
  eyebrow: 'O que a IA simula',
  heading: 'Clientes de verdade, com todas as objeções.',
  badges: [
    { icon: DollarSign, label: 'Acha caro' },
    { icon: HelpCircle, label: 'Indeciso' },
    { icon: GitCompare, label: 'Comparando concorrente' },
    { icon: Clock, label: 'Sem urgência' },
    { icon: ShieldAlert, label: 'Já teve má experiência' },
    { icon: Percent, label: 'Quer desconto' },
    { icon: UserX, label: 'Decisor ausente' },
  ] as { icon: LucideIcon; label: string }[],
}

export function SimulationBadges() {
  return (
    <section id="simula" aria-labelledby="simula-title" className="mx-auto max-w-6xl px-6 py-20">
      <motion.div {...inView} className="max-w-2xl">
        <p className="eyebrow text-brand">{CONTENT.eyebrow}</p>
        <h2
          id="simula-title"
          className="mt-4 text-3xl font-bold leading-tight tracking-[-0.02em] sm:text-4xl md:text-[2.6rem]"
        >
          {CONTENT.heading}
        </h2>
      </motion.div>

      <motion.ul
        variants={stagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
        className="mt-10 flex flex-wrap gap-3"
      >
        {CONTENT.badges.map((b) => (
          <motion.li
            key={b.label}
            variants={rise}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2.5 text-[14px] font-medium text-foreground shadow-soft"
          >
            <span className="grid h-7 w-7 place-items-center rounded-full bg-brand-soft text-brand">
              <b.icon className="h-[15px] w-[15px]" strokeWidth={1.9} aria-hidden />
            </span>
            {b.label}
          </motion.li>
        ))}
      </motion.ul>
    </section>
  )
}
